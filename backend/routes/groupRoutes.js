// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');

// Skapa en ny grupp
router.post('/', async (req, res) => {
  const { name, creatorId, memberIds } = req.body;
  try {
    const newGroup = new Group({
      name,
      creator: creatorId,
      members: memberIds,
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Kunde inte skapa grupp:', error);
    res.status(500).json({ error: 'Kunde inte skapa grupp' });
  }
});

// Hämta grupper för en specifik användare
router.get('/user/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ creator: req.params.userId });
    res.json(groups);
  } catch (error) {
    console.error('Kunde inte hämta grupper:', error);
    res.status(500).json({ error: 'Kunde inte hämta grupper' });
  }
});
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

  router.post('/:groupId/invite', async (req, res) => {
    const { userId } = req.body; // ID för användaren som ska bjudas in
    const { groupId } = req.params;
  
    try {
      const group = await Group.findById(groupId);
      const user = await User.findById(userId);
  
      if (!group) {
        return res.status(404).json({ error: 'Gruppen hittades inte' });
      }
      if (!user) {
        return res.status(404).json({ error: 'Användaren hittades inte' });
      }
  
      // Skicka inbjudan - För enkelhetens skull lägger vi bara till användaren direkt
      if (!group.members.includes(userId)) {
        group.members.push(userId);
        await group.save();
      }
  
      res.json({ message: `Inbjudan skickad till ${user.name}`, group });
    } catch (error) {
      console.error('Kunde inte skicka inbjudan:', error);
      res.status(500).json({ error: 'Kunde inte skicka inbjudan' });
    }
  });

  router.post('/:groupId/invite', async (req, res) => {
    const { email } = req.body; // Ändrat från userId till email
    const { groupId } = req.params;
  
    try {
      const group = await Group.findById(groupId);
      const user = await User.findOne({ email }); // Hitta användaren med e-post
  
      if (!group) {
        return res.status(404).json({ error: 'Gruppen hittades inte' });
      }
      if (!user) {
        return res.status(404).json({ error: 'Användaren hittades inte' });
      }
  
      // Skicka inbjudan - Lägg till användaren direkt i gruppen
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

module.exports = router;
