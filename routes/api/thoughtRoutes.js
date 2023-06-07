const mongoose = require('mongoose');

const router = require('express').Router();
const { User, Thought } = require('../../models');

// the `/api/thoughts` endpoint

// get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get thoughts' });
  }
});


// get one thought by its id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get thought' });
  }
});


// create a new thought
router.post('/', async (req, res) => {
  try {
    console.log(`Request body:`, req.body);
    const thought = await Thought.create(req.body);

    await User.findOneAndUpdate(
      { username: req.body.username },
      { $push: { thoughts: thought._id } }
    );

    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(thought);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create thought' });
  }
});



// update a thought
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update thought' });
  }
});


// delete a thought by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    await User.findByIdAndUpdate(deletedThought.userId, {
      $pull: { thoughts: deletedThought._id }
    });
    res.json({ message: 'Thought deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete thought' });
  }
});


// create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    const reaction = {
      reactionBody: req.body.reactionBody,
      username: req.body.username
    };

    thought.reactions.push(reaction);
    const updatedThought = await thought.save();
    res.json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});


// pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    if (!thought.reactions || thought.reactions.length === 0) {
      return res.status(404).json({ error: 'No reactions found' });
    }

    const reactionId = mongoose.Types.ObjectId(req.params.reactionId);

    const reactionIndex = thought.reactions.findIndex(
      (reaction) => reaction._id && reaction._id.equals(reactionId)
    );

    if (reactionIndex === -1) {
      return res.status(404).json({ error: 'Reaction not found' });
    }

    thought.reactions.splice(reactionIndex, 1);
    const updatedThought = await thought.save();
    res.json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove reaction' });
  }
});

module.exports = router;