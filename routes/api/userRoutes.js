const router = require('express').Router();
const { User, Thought } = require('../../models');

// The `/api/users` endpoint

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get users' });
  }
});


// get a single user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('thoughts friends');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});


// create new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// update a user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


// delete one user by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove the user's associated thoughts
    await Thought.deleteMany({ username: deletedUser.username });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// add a new friend to user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friend = await User.findById(req.params.friendId);
    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    user.friends.push(friend._id);
    await user.save();
    res.json(user);
  }

  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add friend' });
  }
});


// remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friendIndex = user.friends.indexOf(req.params.friendId);
    if (friendIndex === -1) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    user.friends.splice(friendIndex, 1);
    await user.save();
    res.json(user);
  }

  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});


module.exports = router;