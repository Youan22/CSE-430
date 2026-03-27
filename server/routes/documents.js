var express = require('express');
var router = express.Router();

var Document = require('../models/document');
var sequenceGenerator = require('./sequenceGenerator');

router.get('/', function(req, res, next) {
  Document.find()
    .then(function(documents) {
      res.status(200).json({
        message: 'Documents fetched successfully',
        documents: documents
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
  var maxDocumentId = sequenceGenerator.nextId('documents');

  var document = new Document({
    id: String(maxDocumentId),
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    children: req.body.children || []
  });

  document
    .save()
    .then(function(createdDocument) {
      res.status(201).json({
        message: 'Document added successfully',
        document: createdDocument
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
  Document.findOne({ id: req.params.id })
    .then(function(document) {
      if (!document) {
        return res.status(500).json({
          message: 'Document not found.',
          error: { document: 'Document not found' }
        });
      }

      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;
      document.children = req.body.children || [];

      return Document.updateOne({ id: req.params.id }, document);
    })
    .then(function(result) {
      if (!result) return;
      res.status(204).json({
        message: 'Document updated successfully'
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'Document not found.',
        error: { document: 'Document not found' }
      });
    });
});

router.delete('/:id', function(req, res, next) {
  Document.findOne({ id: req.params.id })
    .then(function(document) {
      if (!document) {
        return res.status(500).json({
          message: 'Document not found.',
          error: { document: 'Document not found' }
        });
      }

      return Document.deleteOne({ id: req.params.id });
    })
    .then(function(result) {
      if (!result) return;
      res.status(204).json({
        message: 'Document deleted successfully'
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'Document not found.',
        error: { document: 'Document not found' }
      });
    });
});

module.exports = router;
