// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');

// Endpoint för soft-delete av en grupp (flytta till borttagna grupper)
// Endpoint för soft-delete av en grupp (flytta till borttagna grupper)
router.put('/:groupId/soft-delete', async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findByIdAndUpdate(groupId, { deleted: true }, { new: true });
    if (!group) {
      return res.status(404).send({ message: 'Group not found' });
    }
    res.status(200).send({ message: 'Group successfully moved to deleted groups' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).send({ message: 'Could not delete group' });
  }
});

// Endpoint för att återställa en borttagen grupp
router.put('/:groupId/restore', async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findByIdAndUpdate(groupId, { deleted: false }, { new: true });
    if (!group) {
      return res.status(404).send({ message: 'Group not found' });
    }
    res.status(200).send({ message: 'Group successfully restored' });
  } catch (error) {
    console.error('Error restoring group:', error);
    res.status(500).send({ message: 'Could not restore group' });
  }
});

// Hämta borttagna grupper för en specifik användare
router.get('/user/:userId/deleted', async (req, res) => {
  try {
    const groups = await Group.find({ creator: req.params.userId, deleted: true });
    res.json(groups);
  } catch (error) {
    console.error('Kunde inte hämta borttagna grupper:', error);
    res.status(500).json({ error: 'Kunde inte hämta borttagna grupper' });
  }
});

// Skapa en ny grupp
router.post('/', async (req, res) => {
  const { name, creatorId, memberIds } = req.body;
  try {
    const newGroup = new Group({
      name,
      creator: creatorId,
      members: memberIds,
      deleted: false, // Lägg till 'deleted' fältet och sätt det till false
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Kunde inte skapa grupp:', error);
    res.status(500).json({ error: 'Kunde inte skapa grupp' });
  }
});

// Hämta grupper för en specifik användare (ej borttagna)
router.get('/user/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ creator: req.params.userId, deleted: { $ne: true } });
    res.json(groups);
  } catch (error) {
    console.error('Kunde inte hämta grupper:', error);
    res.status(500).json({ error: 'Kunde inte hämta grupper' });
  }
});

// Hämta borttagna grupper för en specifik användare
router.get('/user/:userId/deleted', async (req, res) => {
  try {
    const deletedGroups = await Group.find({ creator: req.params.userId, deleted: true });
    res.json(deletedGroups);
  } catch (error) {
    console.error('Kunde inte hämta borttagna grupper:', error);
    res.status(500).json({ error: 'Kunde inte hämta borttagna grupper' });
  }
});

// Hämta en specifik grupp
router.get('/:groupId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ error: 'Gruppen hittades inte' });
    }
    res.json(group);
  } catch (error) {
    console.error('Kunde inte hämta grupp:', error);
    res.status(500).json({ error: 'Kunde inte hämta grupp' });
  }
});

// Inbjudningsfunktion för att lägga till användare i en grupp
router.post('/:groupId/invite', async (req, res) => {
  const { email } = req.body;
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    const user = await User.findOne({ email });

    if (!group) {
      return res.status(404).json({ error: 'Gruppen hittades inte' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Användaren hittades inte' });
    }

    if (!group.members.includes(user._id)) {
      group.members.push(user._id);
      await group.save();
    }

    res.json({ message: `Inbjudan skickad till ${user.name}`, group });
  } catch (error) {
    console.error('Kunde inte skicka inbjudan:', error);
    res.status(500).json({ error: 'Kunde inte skicka inbjudan' });
  }
});

// Ändra gruppnamn
router.put('/:id/rename', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(updatedGroup);
  } catch (error) {
    console.error('Error renaming group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
