const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

// POST /user
app.post('/user', (req, res) => {
    const newUser = req.body;

    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (err) {
        console.log('Error reading file:', err);
    }

   
    const emailExists = users.some(user => user.email === newUser.email);
    if (emailExists) {
        return res.status(400).json({ message: 'Email already exists!' });
    }

    users.push(newUser);

    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    } catch (err) {
        console.log('Error writing file:', err);
        return res.status(500).json({ message: 'Failed to save user.' });
    }

    res.status(201).json({ message: 'User added successfully!', user: newUser });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// PATCH /user/:id
app.patch('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, age, email } = req.body;

    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (err) {
        console.log('Error reading file:', err);
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found!' });
    }

   
    if (name) users[userIndex].name = name;
    if (age) users[userIndex].age = age;
    if (email) users[userIndex].email = email;

    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    } catch (err) {
        console.log('Error writing file:', err);
        return res.status(500).json({ message: 'Failed to update user.' });
    }

    res.json({ message: 'User updated successfully!', user: users[userIndex] });
});


// DELETE /user/:id
app.delete('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (err) {
        console.log('Error reading file:', err);
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found!' });
    }


    const deletedUser = users.splice(userIndex, 1)[0];

    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    } catch (err) {
        console.log('Error writing file:', err);
        return res.status(500).json({ message: 'Failed to delete user.' });
    }

    res.json({ message: 'User deleted successfully!', user: deletedUser });
});


// GET /user/getByName
app.get('/user/getByName', (req, res) => {
    const nameQuery = req.query.name;

    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (err) {
        console.log('Error reading file:', err);
    }

    const filteredUsers = users.filter(u => u.name.toLowerCase() === nameQuery.toLowerCase());

    if (filteredUsers.length === 0) {
        return res.status(404).json({ message: 'No user found with that name!' });
    }

    res.json({ users: filteredUsers });
});


// GET /user  -> all users
app.get('/user', (req, res) => {
    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (err) {
        console.log('Error reading file:', err);
    }

    res.json({ users });
});


// GET /user/filter-minAge
app.get('/user/filter', (req, res) => {
    const minAge = parseInt(req.query.minAge);

    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (err) {
        console.log('Error reading file:', err);
    }

    const filteredUsers = users.filter(u => u.age >= minAge);

    if (filteredUsers.length === 0) {
        return res.status(404).json({ message: 'No users found with that age or older!' });
    }

    res.json({ users: filteredUsers });
});


// GET /user/:id
app.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (err) {
        console.log('Error reading file:', err);
    }

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    res.json({ user });
});

