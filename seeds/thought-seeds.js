const { Thought, User } = require('../models');
const thoughtData = require('./thought-data.json');

const seedThoughts = async () => {
  try {
    const users = await User.find({}, '_id username');
    const userMap = users.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});

    const thoughts = thoughtData.map((thought) => ({
      ...thought,
      userId: userMap[thought.username],
    }));

    await Thought.insertMany(thoughts);
    console.log('Thought data seeded successfully.');
  } catch (err) {
    console.error('Error seeding thought data:', err);
  }
};

module.exports = seedThoughts;
