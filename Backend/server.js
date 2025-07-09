const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const UserModel = require('./models/users');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory OTP store: { email: { otp, expiresAt } }
const otpStore = {};

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://mongo:hsIYHADojGQWtqzrdkytiKILvgHQyjDf@caboose.proxy.rlwy.net:10611")

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json('Email and password are required');
        }

        const user = await UserModel.findOne({ email: email });
        
        if (!user) {
            return res.status(401).json('No user found with this email');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json('Incorrect password');
        }

        res.json({
            status: 'Success',
            role: user.role
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json('Server error occurred');
    }
})

app.post('/register', (req, res)=>{
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No user found with this email' });

    const otp = ('' + Math.floor(100000 + Math.random() * 900000)); 
    const expiresAt = Date.now() + 10 * 60 * 1000; 
    otpStore[email] = { otp, expiresAt };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '70001933arin@gmail.com',
            pass: 'gcdhuatufxpdxpll' 
        }
    });

    const mailOptions = {
        from: 'VitalCheck <70001933arin@gmail.com>',
        to: email,
        subject: 'VitalCheck Password Reset OTP',
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 32px; border-radius: 10px; max-width: 480px; margin: auto; border: 1px solid #e7eaf0;">
                <h2 style="color: #2563eb; text-align: center;">VitalCheck Password Reset</h2>
                <p style="font-size: 1.1rem; color: #222;">Hello,</p>
                <p style="font-size: 1.1rem; color: #222;">We received a request to reset your password. Please use the OTP below to proceed:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <span style="display: inline-block; font-size: 2.2rem; letter-spacing: 8px; color: #2563eb; font-weight: bold; background: #e6f0fa; padding: 16px 32px; border-radius: 8px; border: 1px dashed #2563eb;">${otp}</span>
                </div>
                <p style="font-size: 1.05rem; color: #444;">This OTP is valid for <b>10 minutes</b>. If you did not request a password reset, you can safely ignore this email.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #e7eaf0;" />
                <p style="font-size: 0.98rem; color: #888; text-align: center;">Thank you for using <b>VitalCheck</b>.<br/>Stay healthy, stay secure!</p>
                <p style="font-size: 0.95rem; color: #b91c1c; text-align: center; margin-top: 18px;">If you do not see this email in your inbox, please check your <b>Spam</b> or <b>Junk</b> folder.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ status: 'OTP sent to email' });
    } catch (err) {
        console.error('Error sending OTP email:', err);
        res.status(500).json({ error: 'Failed to send OTP email' });
    }
});

app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });
    const record = otpStore[email];
    if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
    if (Date.now() > record.expiresAt) return res.status(400).json({ error: 'OTP expired' });
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    res.json({ status: 'OTP verified' });
});

app.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    const record = otpStore[email];
    if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
    if (Date.now() > record.expiresAt) return res.status(400).json({ error: 'OTP expired' });
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.password = newPassword;
        await user.save();
        delete otpStore[email]; 
        res.json({ status: 'Password reset successful' });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
