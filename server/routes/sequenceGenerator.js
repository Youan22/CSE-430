var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {
  Sequence.findOne()
    .then(function(sequence) {
      if (!sequence) {
        return;
      }

      sequenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId;
      maxMessageId = sequence.maxMessageId;
      maxContactId = sequence.maxContactId;
    })
    .catch(function(err) {
      console.log('SequenceGenerator init error = ' + err);
    });
}

SequenceGenerator.prototype.nextId = function(collectionType) {
  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = { maxDocumentId: maxDocumentId };
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId: maxMessageId };
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = { maxContactId: maxContactId };
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  if (!sequenceId) {
    return -1;
  }

  Sequence.updateOne({ _id: sequenceId }, { $set: updateObject })
    .catch(function(err) {
      console.log('nextId error = ' + err);
      return null;
    });

  return nextId;
};

module.exports = new SequenceGenerator();
