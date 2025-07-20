const express = require('express');
const { query } = require('../database/connection');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Discover profiles with filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      hashtags, // Comma-separated hashtag IDs
      categories, // Comma-separated categories
      search, // Search term for name/bio
      location, // Location filter
      page = 1,
      limit = 20,
      sortBy = 'latest' // latest, popular, alphabetical
    } = req.query;

    const offset = (page - 1) * Math.min(limit, 50); // Max 50 per page
    const currentUserId = req.user?.id;

    // Build WHERE conditions
    const conditions = ['p.is_visible = true'];
    const queryParams = [];
    let paramIndex = 1;

    // Exclude current user
    if (currentUserId) {
      conditions.push(`p.user_id != $${paramIndex++}`);
      queryParams.push(currentUserId);
    }

    // Hashtag filter
    let hashtagJoin = '';
    if (hashtags && hashtags.trim()) {
      const hashtagIds = hashtags.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (hashtagIds.length > 0) {
        hashtagJoin = `
          INNER JOIN user_hashtags uh ON p.user_id = uh.user_id
          INNER JOIN hashtags h ON uh.hashtag_id = h.id
        `;
        conditions.push(`uh.hashtag_id = ANY($${paramIndex++})`);
        queryParams.push(hashtagIds);
      }
    }

    // Category filter (based on hashtags)
    if (categories && categories.trim() && !hashtags) {
      const categoryList = categories.split(',').map(c => c.trim()).filter(c => c);
      if (categoryList.length > 0) {
        hashtagJoin = `
          INNER JOIN user_hashtags uh ON p.user_id = uh.user_id
          INNER JOIN hashtags h ON uh.hashtag_id = h.id
        `;
        conditions.push(`h.category = ANY($${paramIndex++})`);
        queryParams.push(categoryList);
      }
    }

    // Search filter
    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      conditions.push(`(
        LOWER(p.first_name || ' ' || p.last_name) LIKE $${paramIndex++} OR
        LOWER(p.display_name) LIKE $${paramIndex++} OR
        LOWER(p.bio) LIKE $${paramIndex++}
      )`);
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Location filter
    if (location && location.trim()) {
      const locationTerm = `%${location.trim().toLowerCase()}%`;
      conditions.push(`LOWER(p.location) LIKE $${paramIndex++}`);
      queryParams.push(locationTerm);
    }

    // Build ORDER BY clause
    let orderBy = 'p.created_at DESC'; // default: latest
    if (sortBy === 'alphabetical') {
      orderBy = 'p.first_name ASC, p.last_name ASC';
    } else if (sortBy === 'popular') {
      orderBy = 'connection_count DESC, p.created_at DESC';
    }

    // Main query
    const queryText = `
      SELECT DISTINCT
        p.user_id,
        p.first_name,
        p.last_name,
        p.display_name,
        p.bio,
        p.location,
        p.profile_picture_url,
        p.created_at,
        u.membership,
        COUNT(DISTINCT c.id) as connection_count,
        json_agg(DISTINCT 
          json_build_object(
            'id', ph.id,
            'name', ph.name,
            'displayName', ph.display_name,
            'category', ph.category
          )
        ) FILTER (WHERE ph.id IS NOT NULL) as hashtags
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      ${hashtagJoin}
      LEFT JOIN connections c ON (
        (c.requester_id = p.user_id OR c.addressee_id = p.user_id) 
        AND c.status = 'accepted'
      )
      LEFT JOIN user_hashtags puh ON p.user_id = puh.user_id
      LEFT JOIN hashtags ph ON puh.hashtag_id = ph.id AND ph.is_active = true
      WHERE ${conditions.join(' AND ')} AND u.is_active = true
      GROUP BY p.user_id, p.first_name, p.last_name, p.display_name, 
               p.bio, p.location, p.profile_picture_url, p.created_at, u.membership
      ORDER BY ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT p.user_id) as total
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      ${hashtagJoin}
      WHERE ${conditions.join(' AND ')} AND u.is_active = true
    `;

    const [profilesResult, countResult] = await Promise.all([
      query(queryText, queryParams),
      query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
    ]);

    const profiles = profilesResult.rows.map(profile => ({
      userId: profile.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      displayName: profile.display_name,
      bio: profile.bio,
      location: profile.location,
      profilePicture: profile.profile_picture_url,
      membership: profile.membership,
      connectionCount: parseInt(profile.connection_count),
      hashtags: profile.hashtags || [],
      joinedAt: profile.created_at
    }));

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    res.json({
      success: true,
      data: {
        profiles,
        pagination: {
          currentPage: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasMore
        },
        filters: {
          hashtags: hashtags?.split(',').filter(Boolean) || [],
          categories: categories?.split(',').filter(Boolean) || [],
          search: search || '',
          location: location || '',
          sortBy
        }
      }
    });

  } catch (error) {
    console.error('Discovery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profiles'
    });
  }
});

// Get profile by user ID
router.get('/profile/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    // Get profile with hashtags
    const result = await query(`
      SELECT 
        p.user_id,
        p.first_name,
        p.last_name,
        p.display_name,
        p.bio,
        p.location,
        p.website,
        p.linkedin_url,
        p.github_url,
        p.profile_picture_url,
        p.is_visible,
        p.created_at,
        u.membership,
        u.email,
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
      WHERE p.user_id = $1 AND u.is_active = true
      GROUP BY p.user_id, p.first_name, p.last_name, p.display_name, 
               p.bio, p.location, p.website, p.linkedin_url, p.github_url,
               p.profile_picture_url, p.is_visible, p.created_at, 
               u.membership, u.email
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const profile = result.rows[0];

    // Check if profile is visible or if it's the owner
    if (!profile.is_visible && profile.user_id !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'This profile is private'
      });
    }

    res.json({
      success: true,
      data: {
        profile: {
          userId: profile.user_id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          displayName: profile.display_name,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          linkedinUrl: profile.linkedin_url,
          githubUrl: profile.github_url,
          profilePicture: profile.profile_picture_url,
          membership: profile.membership,
          isVisible: profile.is_visible,
          joinedAt: profile.created_at,
          hashtags: profile.hashtags || [],
          ...(currentUserId === profile.user_id && { email: profile.email })
        },
        isOwnProfile: currentUserId === profile.user_id
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

module.exports = router; 