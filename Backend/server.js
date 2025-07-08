const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const UserModel = require('./models/users');

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://mongo:hsIYHADojGQWtqzrdkytiKILvgHQyjDf@caboose.proxy.rlwy.net:10611")

app.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json('All fields are required');
        }

        const user = await UserModel.findOne({ email: email });
        
        if (!user) {
            return res.status(401).json('No user found with this email');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json('Incorrect password');
        }

        if (user.role !== role) {
            return res.status(401).json('Invalid role for this user');
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

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
