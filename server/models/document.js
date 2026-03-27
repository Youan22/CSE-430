const mongoose = require('mongoose');

const childSchema = mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String },
    description: { type: String }
  },
  { _id: false }
);

const documentSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String },
  description: { type: String },
  children: [childSchema]
});

module.exports = mongoose.model('Document', documentSchema);
