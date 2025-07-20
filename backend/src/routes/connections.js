const express = require('express');
const { query, getClient } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { validate, connectionRequestSchema } = require('../middleware/validation');

const router = express.Router();

// Send connection request
router.post('/', authenticateToken, validate(connectionRequestSchema), async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const { addresseeId, message } = req.body;
    const requesterId = req.user.id;

    // Can't connect to yourself
    if (requesterId === addresseeId) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'You cannot send a connection request to yourself'
      });
    }

    // Check if addressee exists and is active
    const addresseeResult = await client.query(`
      SELECT u.id, u.is_active, p.first_name, p.last_name 
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [addresseeId]);

    if (addresseeResult.rows.length === 0 || !addresseeResult.rows[0].is_active) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if connection already exists
    const existingConnection = await client.query(`
      SELECT status FROM connections
      WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)
    `, [requesterId, addresseeId]);

    if (existingConnection.rows.length > 0) {
      await client.query('ROLLBACK');
      const status = existingConnection.rows[0].status;
      return res.status(409).json({
        success: false,
        message: status === 'accepted' 
          ? 'You are already connected with this user'
          : status === 'blocked'
          ? 'Cannot send connection request'
          : 'Connection request already exists'
      });
    }

    // Create connection request
    const result = await client.query(`
      INSERT INTO connections (requester_id, addressee_id, status, message)
      VALUES ($1, $2, 'pending', $3)
      RETURNING id, created_at
    `, [requesterId, addresseeId, message]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: {
        connectionId: result.rows[0].id,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Send connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send connection request'
    });
  } finally {
    client.release();
  }
});

// Accept/decline connection request
router.put('/:connectionId', authenticateToken, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { action } = req.body; // 'accept' or 'decline'
    const userId = req.user.id;

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "accept" or "decline"'
      });
    }

    // Check if connection exists and user is the addressee
    const connectionResult = await query(`
      SELECT requester_id, addressee_id, status
      FROM connections
      WHERE id = $1 AND addressee_id = $2
    `, [connectionId, userId]);

    if (connectionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    const connection = connectionResult.rows[0];

    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Connection request has already been processed'
      });
    }

    // Update connection status
    const newStatus = action === 'accept' ? 'accepted' : 'blocked';
    
    await query(`
      UPDATE connections 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [newStatus, connectionId]);

    res.json({
      success: true,
      message: `Connection request ${action}ed successfully`,
      data: {
        status: newStatus
      }
    });

  } catch (error) {
    console.error('Update connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update connection request'
    });
  }
});

// Get user's connections
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'accepted' } = req.query;

    const result = await query(`
      SELECT 
        c.id,
        c.status,
        c.message,
        c.created_at,
        c.requester_id = $1 as is_requester,
        CASE 
          WHEN c.requester_id = $1 THEN p2.user_id
          ELSE p1.user_id
        END as connected_user_id,
        CASE 
          WHEN c.requester_id = $1 THEN p2.first_name
          ELSE p1.first_name
        END as connected_first_name,
        CASE 
          WHEN c.requester_id = $1 THEN p2.last_name
          ELSE p1.last_name
        END as connected_last_name,
        CASE 
          WHEN c.requester_id = $1 THEN p2.display_name
          ELSE p1.display_name
        END as connected_display_name,
        CASE 
          WHEN c.requester_id = $1 THEN p2.profile_picture_url
          ELSE p1.profile_picture_url
        END as connected_profile_picture
      FROM connections c
      JOIN profiles p1 ON c.requester_id = p1.user_id
      JOIN profiles p2 ON c.addressee_id = p2.user_id
      WHERE (c.requester_id = $1 OR c.addressee_id = $1) AND c.status = $2
      ORDER BY c.created_at DESC
    `, [userId, status]);

    const connections = result.rows.map(row => ({
      id: row.id,
      status: row.status,
      message: row.message,
      createdAt: row.created_at,
      isRequester: row.is_requester,
      connectedUser: {
        id: row.connected_user_id,
        firstName: row.connected_first_name,
        lastName: row.connected_last_name,
        displayName: row.connected_display_name,
        profilePicture: row.connected_profile_picture
      }
    }));

    res.json({
      success: true,
      data: {
        connections,
        status
      }
    });

  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connections'
    });
  }
});

module.exports = router; 