const express = require("express");
const Medication = require("../models/Medication");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const items = await Medication.find().sort({ updatedAt: -1 }).lean();
    res.json(items.map(toDto));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await Medication.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(toDto(doc));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Medication.create(sanitizeBody(req.body));
    res.status(201).json(toDto(created.toObject()));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Medication.findByIdAndUpdate(
      req.params.id,
      sanitizeBody(req.body),
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(toDto(updated));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Medication.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function sanitizeBody(body) {
  const {
    name,
    dosage,
    frequency,
    instructions,
    startDate,
    endDate,
    notes,
    reminders,
    doseHistory,
  } = body;
  return {
    name,
    dosage,
    frequency,
    instructions,
    startDate,
    endDate,
    notes,
    reminders: Array.isArray(reminders) ? reminders : [],
    doseHistory: Array.isArray(doseHistory) ? doseHistory : [],
  };
}

function toDto(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    dosage: doc.dosage,
    frequency: doc.frequency,
    instructions: doc.instructions ?? "",
    startDate: doc.startDate,
    endDate: doc.endDate,
    notes: doc.notes,
    reminders: doc.reminders ?? [],
    doseHistory: doc.doseHistory ?? [],
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

module.exports = router;
