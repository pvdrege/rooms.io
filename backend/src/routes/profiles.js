const express = require('express');
const { query, getClient } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { validate, profileUpdateSchema } = require('../middleware/validation');

const router = express.Router();

// Get current user's profile
router.get('/me', authenticateToken, async (req, res) => {
  const client = await getClient();
  
  try {
    const userId = req.user.id;

    const result = await client.query(`
      SELECT 
        p.*,
        u.membership,
        json_agg(
          DISTINCT json_build_object(
            'id', h.id,
            'name', h.name,
            'displayName', h.display_name,
            'category', h.category
          )
        ) FILTER (WHERE h.id IS NOT NULL) as hashtags
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN user_hashtags uh ON p.user_id = uh.user_id
      LEFT JOIN hashtags h ON uh.hashtag_id = h.id AND h.is_active = true
      WHERE p.user_id = $1
      GROUP BY p.id, u.membership
    `, [userId]);

    const profile = result.rows[0];

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: profile.id,
        userId: profile.user_id,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        pictureUrl: profile.profile_picture_url,
        hashtags: profile.hashtags || [],
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        user: {
          id: req.user.id,
          email: req.user.email,
          name: profile.display_name || req.user.name,
          pictureUrl: profile.profile_picture_url
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  } finally {
    client.release();
  }
});

// Update current user's profile
router.put('/', authenticateToken, validate(profileUpdateSchema), async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      displayName,
      bio,
      location,
      website,
      linkedinUrl,
      githubUrl,
      isVisible,
      hashtags = []
    } = req.body;

    // Check hashtag limit based on membership
    const maxHashtags = req.user.membership === 'premium' ? 50 : 2;
    if (hashtags.length > maxHashtags) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `${req.user.membership === 'premium' ? 'Premium' : 'Free'} users can select maximum ${maxHashtags} hashtags`
      });
    }

    // Update profile
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (firstName !== undefined) {
      updateFields.push(`first_name = $${paramIndex++}`);
      updateValues.push(firstName);
    }
    if (lastName !== undefined) {
      updateFields.push(`last_name = $${paramIndex++}`);
      updateValues.push(lastName);
    }
    if (displayName !== undefined) {
      updateFields.push(`display_name = $${paramIndex++}`);
      updateValues.push(displayName || `${firstName || ''} ${lastName || ''}`.trim());
    }
    if (bio !== undefined) {
      updateFields.push(`bio = $${paramIndex++}`);
      updateValues.push(bio);
    }
    if (location !== undefined) {
      updateFields.push(`location = $${paramIndex++}`);
      updateValues.push(location);
    }
    if (website !== undefined) {
      updateFields.push(`website = $${paramIndex++}`);
      updateValues.push(website);
    }
    if (linkedinUrl !== undefined) {
      updateFields.push(`linkedin_url = $${paramIndex++}`);
      updateValues.push(linkedinUrl);
    }
    if (githubUrl !== undefined) {
      updateFields.push(`github_url = $${paramIndex++}`);
      updateValues.push(githubUrl);
    }
    if (isVisible !== undefined) {
      updateFields.push(`is_visible = $${paramIndex++}`);
      updateValues.push(isVisible);
    }

    if (updateFields.length > 0) {
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateValues.push(userId);

      const updateQuery = `
        UPDATE profiles 
        SET ${updateFields.join(', ')}
        WHERE user_id = $${paramIndex++}
        RETURNING *
      `;

      await client.query(updateQuery, updateValues);
    }

    // Update hashtags if provided
    if (hashtags.length >= 0) {
      // Remove existing hashtags
      await client.query('DELETE FROM user_hashtags WHERE user_id = $1', [userId]);

      // Add new hashtags
      if (hashtags.length > 0) {
        // Validate hashtag IDs exist
        const validHashtags = await client.query(`
          SELECT id FROM hashtags 
          WHERE id = ANY($1) AND is_active = true
        `, [hashtags]);

        if (validHashtags.rows.length !== hashtags.length) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            success: false,
            message: 'Some selected hashtags are invalid or inactive'
          });
        }

        // Insert new hashtags
        const hashtagInserts = hashtags.map((hashtagId, index) => 
          `($1, $${index + 2})`
        ).join(', ');

        await client.query(
          `INSERT INTO user_hashtags (user_id, hashtag_id) VALUES ${hashtagInserts}`,
          [userId, ...hashtags]
        );
      }
    }

    await client.query('COMMIT');

    // Get updated profile with hashtags
    const result = await query(`
      SELECT 
        p.*,
        u.membership,
        json_agg(
          DISTINCT json_build_object(
            'id', h.id,
            'name', h.name,
            'displayName', h.display_name,
            'category', h.category
          )
        ) FILTER (WHERE h.id IS NOT NULL) as hashtags
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN user_hashtags uh ON p.user_id = uh.user_id
      LEFT JOIN hashtags h ON uh.hashtag_id = h.id AND h.is_active = true
      WHERE p.user_id = $1
      GROUP BY p.id, u.membership
    `, [userId]);

    const profile = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          displayName: profile.display_name,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          linkedinUrl: profile.linkedin_url,
          githubUrl: profile.github_url,
          profilePicture: profile.profile_picture_url,
          isVisible: profile.is_visible,
          hashtags: profile.hashtags || [],
          updatedAt: profile.updated_at
        }
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  } finally {
    client.release();
  }
});

// Upload profile picture (placeholder - would integrate with file upload service)
router.post('/picture', authenticateToken, async (req, res) => {
  try {
    // This is a placeholder for file upload functionality
    // In production, you would integrate with services like AWS S3, Cloudinary, etc.
    
    res.status(501).json({
      success: false,
      message: 'Profile picture upload not yet implemented'
    });

  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture'
    });
  }
});

// Delete profile picture
router.delete('/picture', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await query(`
      UPDATE profiles 
      SET profile_picture_url = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [userId]);

    res.json({
      success: true,
      message: 'Profile picture removed successfully'
    });

  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile picture'
    });
  }
});

module.exports = router; 