var express = require('express');
var router = express.Router();

var Message = require('../models/message');
var Contact = require('../models/contact');
var sequenceGenerator = require('./sequenceGenerator');

function mapSenderToObjectId(sender) {
  if (!sender) {
    return Promise.resolve(null);
  }

  // Sender can be an already-resolved Mongo ObjectId string.
  if (typeof sender === 'string' && sender.length === 24) {
    return Promise.resolve(sender);
  }

  // Sender can be the UI contact id (e.g., "7"), map it to Contact._id.
  if (typeof sender === 'string') {
    return Contact.findOne({ id: sender }).then(function(contact) {
      return contact ? contact._id : null;
    });
  }

  // Sender can arrive as a populated contact object.
  if (typeof sender === 'object' && sender._id) {
    return Promise.resolve(sender._id);
  }

  return Promise.resolve(null);
}

router.get('/', function(req, res, next) {
  Message.find()
    .populate('sender')
    .then(function(messages) {
      res.status(200).json({
        message: 'Messages fetched successfully',
        messages: messages
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
  var maxMessageId = sequenceGenerator.nextId('messages');

  mapSenderToObjectId(req.body.sender)
    .then(function(senderObjectId) {
      var message = new Message({
        id: String(maxMessageId),
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: senderObjectId
      });

      return message.save();
    })
    .then(function(createdMessage) {
      res.status(201).json({
        message: 'Message added successfully',
        messageObject: createdMessage
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
  Message.findOne({ id: req.params.id })
    .then(function(message) {
      if (!message) {
        return res.status(500).json({
          message: 'Message not found.',
          error: { message: 'Message not found' }
        });
      }

      return mapSenderToObjectId(req.body.sender).then(function(senderObjectId) {
        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        message.sender = senderObjectId;

        return Message.updateOne({ id: req.params.id }, message);
      });
    })
    .then(function(result) {
      if (!result) return;
      res.status(204).json({
        message: 'Message updated successfully'
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'Message not found.',
        error: { message: 'Message not found' }
      });
    });
});

router.delete('/:id', function(req, res, next) {
  Message.findOne({ id: req.params.id })
    .then(function(message) {
      if (!message) {
        return res.status(500).json({
          message: 'Message not found.',
          error: { message: 'Message not found' }
        });
      }

      return Message.deleteOne({ id: req.params.id });
    })
    .then(function(result) {
      if (!result) return;
      res.status(204).json({
        message: 'Message deleted successfully'
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'Message not found.',
        error: { message: 'Message not found' }
      });
    });
});

module.exports = router;
