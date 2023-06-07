const { Reaction, User, Thought } = require('../models');
const reactionData = require('./reaction-data.json');

const seedReactions = async () => {
    try {
        const users = await User.find({}, '_id username');
        const userMap = users.reduce((map, user) => {
            map[user.username] = user._id;
            return map;
        }, {});

        const thoughts = await Thought.find({}, '_id');

        const reactions = reactionData.map((reaction) => ({
            ...reaction,
            userId: userMap[reaction.username],
            thoughtId: thoughts[Math.floor(Math.random() * thoughts.length)]._id,
        }));

        await Reaction.insertMany(reactions);
        console.log('Reaction data seeded successfully.');
    } catch (err) {
        console.error('Error seeding reaction data:', err);
    }
};

module.exports = seedReactions;