import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import 'dotenv/config'
import auth from "../middleware/auth.js";

const router = express.Router();


// User registration
router.post('/register', async (req, res) => {
    const { name, password, email } = req.body;

    let regex = /^\w+([\.-]?\w+)*@imt-atlantique\.net$/

    if (name && name.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!email || !regex.test(email)) {
        return res.status(400).json({ error: 'Invalid email provided.' });
    }
    try {
        if (await prisma.user.findUnique({ where: { email } })) {
            return res.status(409).json({ error: 'User already registered' });
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Registration failed' });
    }

    try {

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        if (newUser){
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            console.error(error)
            res.status(500).json({ error: 'Failed to add user to database' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(401).json({ error: 'Username not registered' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Wrong password' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;