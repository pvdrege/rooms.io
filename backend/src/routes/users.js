const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM connections 
         WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'accepted'
        ) as total_connections,
        (SELECT COUNT(*) FROM connections 
         WHERE addressee_id = $1 AND status = 'pending'
        ) as pending_requests,
        (SELECT COUNT(*) FROM messages 
         WHERE receiver_id = $1 AND is_read = false
        ) as unread_messages,
        (SELECT COUNT(*) FROM user_hashtags 
         WHERE user_id = $1
        ) as total_hashtags
    `, [userId]);

    res.json({
      success: true,
      data: {
        stats: stats.rows[0]
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailNotifications, smsNotifications } = req.body;

    // For now, just return success
    // In a real implementation, you'd store these preferences in a settings table
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        emailNotifications: emailNotifications ?? true,
        smsNotifications: smsNotifications ?? false
      }
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Deactivate account
router.post('/deactivate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await query(`
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [userId]);

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate account'
    });
  }
});

module.exports = router; 