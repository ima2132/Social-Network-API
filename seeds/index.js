const seedUsers = require('./user-seeds');
const seedThoughts = require('./thought-seeds');
const seedReactions = require('./reaction-seeds');

const seedAll = async () => {
  console.log('\n----- DATABASE SYNCED -----\n');
  try {
    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    await seedThoughts();
    console.log('\n----- THOUGHTS SEEDED -----\n');

    await seedReactions();
    console.log('\n----- REACTIONS SEEDED -----\n');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedAll();