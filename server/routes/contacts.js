var express = require('express');
var router = express.Router();

var Contact = require('../models/contact');
var sequenceGenerator = require('./sequenceGenerator');

function normalizeGroupInput(group) {
  if (!Array.isArray(group)) {
    return [];
  }

  return group
    .map(function(item) {
      if (!item) return null;
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item.id) return String(item.id);
      return null;
    })
    .filter(function(id) {
      return id !== null;
    });
}

function mapGroupToObjectIds(group) {
  var groupIds = normalizeGroupInput(group);
  if (groupIds.length === 0) {
    return Promise.resolve([]);
  }

  return Contact.find({ id: { $in: groupIds } })
    .then(function(groupContacts) {
      return groupContacts.map(function(contact) {
        return contact._id;
      });
    });
}

router.get('/', function(req, res, next) {
  Contact.find()
    .populate('group')
    .then(function(contacts) {
      res.status(200).json({
        message: 'Contacts fetched successfully',
        contacts: contacts
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.post('/', function(req, res, next) {
  var maxContactId = sequenceGenerator.nextId('contacts');

  mapGroupToObjectIds(req.body.group)
    .then(function(groupObjectIds) {
      var contact = new Contact({
        id: String(maxContactId),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: groupObjectIds
      });

      return contact.save();
    })
    .then(function(createdContact) {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.put('/:id', function(req, res, next) {
  Contact.findOne({ id: req.params.id })
    .then(function(contact) {
      if (!contact) {
        return res.status(500).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }

      return mapGroupToObjectIds(req.body.group)
        .then(function(groupObjectIds) {
          contact.name = req.body.name;
          contact.email = req.body.email;
          contact.phone = req.body.phone;
          contact.imageUrl = req.body.imageUrl;
          contact.group = groupObjectIds;

          return Contact.updateOne({ id: req.params.id }, contact);
        });
    })
    .then(function(result) {
      if (!result) return;
      res.status(204).json({
        message: 'Contact updated successfully'
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found' }
      });
    });
});

router.delete('/:id', function(req, res, next) {
  Contact.findOne({ id: req.params.id })
    .then(function(contact) {
      if (!contact) {
        return res.status(500).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }

      return Contact.deleteOne({ id: req.params.id });
    })
    .then(function(result) {
      if (!result) return;
      res.status(204).json({
        message: 'Contact deleted successfully'
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found' }
      });
    });
});

module.exports = router;
