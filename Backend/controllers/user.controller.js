// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { eq } from 'drizzle-orm';
// import { db } from '../db';
// import { users } from '../db/schema';

// const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_development';

// /**
//  * @desc    Register a new user
//  * @route   POST /api/auth/register
//  * @access  Public
//  */
// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     // 1. Enforce strict password complexity (Hacker defense)
//     if (password.length < 12) {
//       return res.status(400).json({ error: 'Password must be at least 12 characters long' });
//     }

//     // 2. Check if user already exists
//     const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
//     if (existingUser) {
//       // UX vs Security Tradeoff: 
//       // We return 400 here for UX, but in ultra-secure environments, 
//       // you return a 200 "If the email is valid, a confirmation link was sent" 
//       // to prevent email enumeration.
//       return res.status(400).json({ error: 'Email is already registered' });
//     }

//     // 3. Hash the password (Work factor 12)
//     const saltRounds = 12;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // 4. Insert into PostgreSQL using Drizzle
//     // Notice we use .returning() to get the inserted user, but strictly EXCLUDE the hash.
//     const [newUser] = await db.insert(users).values({
//       email,
//       password_hash: hashedPassword,
//     }).returning({
//       id: users.id,
//       email: users.email,
//       role: users.role,
//       createdAt: users.createdAt
//     });

//     return res.status(201).json({ 
//       message: 'User registered successfully',
//       user: newUser 
//     });

//   } catch (error) {
//     console.error('[Register Error]', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// /**
//  * @desc    Authenticate user & get token
//  * @route   POST /api/auth/login
//  * @access  Public
//  */
// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Fetch user by email
//     const [user] = await db.select().from(users).where(eq(users.email, email));

//     // 2. Constant-time dummy hash check (Timing Attack Defense)
//     // If the user isn't found, we still run bcrypt.compare against a dummy hash.
//     // This ensures the server always takes ~100ms to respond, masking whether 
//     // the email exists or the password was just wrong.
//     if (!user) {
//       await bcrypt.compare(password, '$2b$12$dummyHashThatTakesTimeToBeComputed1234567890123456789012');
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // 3. Compare actual password
//     const isMatch = await bcrypt.compare(password, user.password_hash);
    
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // 4. Generate JWT
//     const payload = { id: user.id, email: user.email, role: user.role };
//     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

//     // 5. Issue FAANG-grade secure HttpOnly cookie
//     res.cookie('token', token, {
//       httpOnly: true, // Invisible to JavaScript (XSS defense)
//       secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
//       sameSite: 'strict', // CSRF defense
//       maxAge: 12 * 60 * 60 * 1000 // 12 hours
//     });

//     return res.status(200).json({ 
//       message: 'Login successful',
//       user: payload
//     });

//   } catch (error) {
//     console.error('[Login Error]', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// /**
//  * @desc    Logout user & clear cookie
//  * @route   POST /api/auth/logout
//  * @access  Private
//  */
// export const logoutUser = (req: Request, res: Response) => {
//   res.clearCookie('token', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   });
//   return res.status(200).json({ message: 'Logged out successfully' });
// };

// /**
//  * @desc    Get current logged-in user profile
//  * @route   GET /api/auth/me
//  * @access  Private
//  */
// export const getCurrentUser = async (req: Request, res: Response) => {
//   try {
//     // req.user is populated by our auth middleware
//     const userId = req.user?.id; 

//     if (!userId) {
//       return res.status(401).json({ error: 'Not authenticated' });
//     }

//     // Fetch fresh user data from DB, explicitly excluding the password hash
//     const [user] = await db.select({
//       id: users.id,
//       email: users.email,
//       role: users.role,
//       createdAt: users.createdAt
//     })
//     .from(users)
//     .where(eq(users.id, userId));

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     return res.status(200).json({ user });
//   } catch (error) {
//     console.error('[GetCurrentUser Error]', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };