import jwt from 'jsonwebtoken';
import { prisma } from "../app.js";
import 'dotenv/config'

async function auth(req, res, next) {
    if (!req.header('Authorization')) return res.status(401).json({ error: "Access denied. Authentification token must be passed with 'Authorization' header" });

    const [method, token] = req.header('Authorization').split(" ");
    if (method !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization challenge type. Should be Bearer' });
    if (!token) return res.status(401).json({ error: 'Access token must be provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    try {
        const user = await prisma.user.findUnique({	where: { id: req.userId } });
        if (!user) return res.status(401).json({ error: 'User does not exist' });
        req.user = user;
        req.isAdmin = user.role === 'ADMIN';

        next();
    } catch(error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to authenticate' });
    }
};

export default auth;