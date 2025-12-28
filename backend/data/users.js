const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@freshkart.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'Karanam Jayasri',
        email: 'karanamjayasri162@gmail.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
];

module.exports = users;
