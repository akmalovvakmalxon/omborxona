"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.refresh = exports.login = exports.register = void 0;
const argon2_1 = __importDefault(require("argon2"));
const connection_1 = __importDefault(require("../config/connection"));
const jwt_1 = require("../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, role } = req.body;
    if (!fullname || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Check if user exists
        const userCheck = yield connection_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }
        // Hash password with argon2
        const hashedPassword = yield argon2_1.default.hash(password);
        // Insert new user
        const result = yield connection_1.default.query('INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, fullname, email, role', [fullname, email, hashedPassword, role]);
        const newUser = result.rows[0];
        // Generate tokens
        const tokens = (0, jwt_1.generateTokens)(newUser.id, newUser.email);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            tokens
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        // Find user by email
        const result = yield connection_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check if password hash is from argon2 or old plain dummy data.
        // The dummy data had 'hashed_password1'. Argon2 verify will fail on it, 
        // so we just try to verify and catch or handle it gracefully.
        try {
            const isMatch = yield argon2_1.default.verify(user.password, password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }
        catch (err) {
            // If argon2.verify fails (e.g. dummy string without valid argon2 hash format)
            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }
        // Generate tokens
        const tokens = (0, jwt_1.generateTokens)(user.id, user.email);
        // Return user data without password
        const { password: _ } = user, userData = __rest(user, ["password"]);
        res.status(200).json({
            message: 'Login successful',
            user: userData,
            tokens
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }
    try {
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        // Generate new tokens
        const tokens = (0, jwt_1.generateTokens)(decoded.id, decoded.email);
        res.status(200).json({
            message: 'Tokens refreshed successfully',
            tokens
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
});
exports.refresh = refresh;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const result = yield connection_1.default.query('SELECT id, fullname, email, role FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: result.rows[0] });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.me = me;
