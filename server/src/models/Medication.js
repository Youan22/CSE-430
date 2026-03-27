const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const doseRecordSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    timestamp: { type: String, required: true },
    taken: { type: Boolean, default: false },
    notes: String,
  },
  { _id: false }
);

const medicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "as_needed"],
      default: "daily",
    },
    instructions: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: String,
    notes: String,
    reminders: [reminderSchema],
    doseHistory: [doseRecordSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", medicationSchema);
