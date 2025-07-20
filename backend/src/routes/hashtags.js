const express = require('express');
const { query } = require('../database/connection');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all active hashtags, grouped by category
router.get('/', optionalAuth, async (req, res) => {
  try {
    const result = await query(`
      SELECT id, name, display_name, category
      FROM hashtags
      WHERE is_active = true
      ORDER BY category, display_name
    `);

    // Group hashtags by category
    const groupedHashtags = result.rows.reduce((acc, hashtag) => {
      if (!acc[hashtag.category]) {
        acc[hashtag.category] = [];
      }
      acc[hashtag.category].push({
        id: hashtag.id,
        name: hashtag.name,
        displayName: hashtag.display_name
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        hashtags: result.rows,
        groupedHashtags
      }
    });

  } catch (error) {
    console.error('Get hashtags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hashtags'
    });
  }
});

// Get hashtags by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const result = await query(`
      SELECT id, name, display_name, category
      FROM hashtags
      WHERE is_active = true AND category = $1
      ORDER BY display_name
    `, [category]);

    res.json({
      success: true,
      data: {
        hashtags: result.rows,
        category
      }
    });

  } catch (error) {
    console.error('Get hashtags by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hashtags'
    });
  }
});

// Get popular hashtags (most used ones)
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await query(`
      SELECT 
        h.id, h.name, h.display_name, h.category,
        COUNT(uh.user_id) as user_count
      FROM hashtags h
      LEFT JOIN user_hashtags uh ON h.id = uh.hashtag_id
      WHERE h.is_active = true
      GROUP BY h.id, h.name, h.display_name, h.category
      ORDER BY user_count DESC, h.display_name
      LIMIT $1
    `, [limit]);

    res.json({
      success: true,
      data: {
        hashtags: result.rows
      }
    });

  } catch (error) {
    console.error('Get popular hashtags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular hashtags'
    });
  }
});

// Get hashtag statistics
router.get('/stats', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        h.category,
        COUNT(DISTINCT h.id) as total_hashtags,
        COUNT(DISTINCT uh.user_id) as total_users
      FROM hashtags h
      LEFT JOIN user_hashtags uh ON h.id = uh.hashtag_id
      WHERE h.is_active = true
      GROUP BY h.category
      ORDER BY total_users DESC
    `);

    const totalStats = await query(`
      SELECT 
        COUNT(DISTINCT h.id) as total_hashtags,
        COUNT(DISTINCT uh.user_id) as total_users_with_hashtags,
        COUNT(uh.id) as total_assignments
      FROM hashtags h
      LEFT JOIN user_hashtags uh ON h.id = uh.hashtag_id
      WHERE h.is_active = true
    `);

    res.json({
      success: true,
      data: {
        categoryStats: result.rows,
        totalStats: totalStats.rows[0]
      }
    });

  } catch (error) {
    console.error('Get hashtag stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hashtag statistics'
    });
  }
});

// Search hashtags
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchTerm = `%${q.trim().toLowerCase()}%`;
    
    const result = await query(`
      SELECT id, name, display_name, category
      FROM hashtags
      WHERE is_active = true 
        AND (LOWER(name) LIKE $1 OR LOWER(display_name) LIKE $1)
      ORDER BY 
        CASE 
          WHEN LOWER(name) = LOWER($2) THEN 1
          WHEN LOWER(display_name) = LOWER($2) THEN 2
          WHEN LOWER(name) LIKE $3 THEN 3
          WHEN LOWER(display_name) LIKE $3 THEN 4
          ELSE 5
        END,
        display_name
      LIMIT 20
    `, [searchTerm, q.trim().toLowerCase(), `${q.trim().toLowerCase()}%`]);

    res.json({
      success: true,
      data: {
        hashtags: result.rows,
        query: q.trim()
      }
    });

  } catch (error) {
    console.error('Search hashtags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search hashtags'
    });
  }
});

module.exports = router; 