const { User } = require('../models');
const userData = require('./user-data.json');

const seedUsers = async () => {
    try {
        await User.insertMany(userData);
        console.log('User data seeded successfully.');
    } catch (err) {
        console.error('Error seeding user data:', err);
    }
};

module.exports = seedUsers;
