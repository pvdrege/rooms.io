const express = require('express');
const bcrypt = require('bcryptjs');
const { query, getClient } = require('../database/connection');
const { authenticateToken, generateToken } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

const router = express.Router();

// Register new user
router.post('/register', validate(registerSchema), async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, email_verified) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, membership, created_at`,
      [email.toLowerCase(), hashedPassword, false]
    );

    const user = userResult.rows[0];

    // Create profile
    const profileResult = await client.query(
      `INSERT INTO profiles (user_id, first_name, last_name, display_name, is_visible) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, first_name, last_name, display_name, created_at`,
      [user.id, firstName, lastName, `${firstName} ${lastName}`, true]
    );

    const profile = profileResult.rows[0];

    await client.query('COMMIT');

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          membership: user.membership,
          profile: {
            id: profile.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            displayName: profile.display_name,
            createdAt: profile.created_at
          }
        }
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  } finally {
    client.release();
  }
});

// Login user
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user with profile
    const result = await query(`
      SELECT 
        u.id, u.email, u.password_hash, u.membership, u.is_active,
        p.id as profile_id, p.first_name, p.last_name, p.display_name,
        p.profile_picture_url, p.is_visible, p.bio, p.location
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.email = $1
    `, [email.toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Get user's hashtags
    const hashtagResult = await query(`
      SELECT h.id, h.name, h.display_name, h.category
      FROM hashtags h
      JOIN user_hashtags uh ON h.id = uh.hashtag_id
      WHERE uh.user_id = $1
    `, [user.id]);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          membership: user.membership,
          profile: {
            id: user.profile_id,
            firstName: user.first_name,
            lastName: user.last_name,
            displayName: user.display_name,
            profilePicture: user.profile_picture_url,
            bio: user.bio,
            location: user.location,
            isVisible: user.is_visible,
            hashtags: hashtagResult.rows
          }
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Get current user (verify token)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Get user with profile and hashtags
    const result = await query(`
      SELECT 
        u.id, u.email, u.membership, u.is_active,
        p.id as profile_id, p.first_name, p.last_name, p.display_name,
        p.profile_picture_url, p.is_visible, p.bio, p.location,
        p.website, p.linkedin_url, p.github_url
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    // Get user's hashtags
    const hashtagResult = await query(`
      SELECT h.id, h.name, h.display_name, h.category
      FROM hashtags h
      JOIN user_hashtags uh ON h.id = uh.hashtag_id
      WHERE uh.user_id = $1
    `, [user.id]);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          membership: user.membership,
          profile: {
            id: user.profile_id,
            firstName: user.first_name,
            lastName: user.last_name,
            displayName: user.display_name,
            profilePicture: user.profile_picture_url,
            bio: user.bio,
            location: user.location,
            website: user.website,
            linkedinUrl: user.linkedin_url,
            githubUrl: user.github_url,
            isVisible: user.is_visible,
            hashtags: hashtagResult.rows
          }
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

// Logout (client-side token removal, but we can blacklist tokens in future)
router.post('/logout', authenticateToken, (req, res) => {
  // For now, just send success response
  // In production, you might want to implement token blacklisting
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router; 