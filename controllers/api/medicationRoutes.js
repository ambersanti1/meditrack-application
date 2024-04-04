const router = require("express").Router();
const { Medication } = require("../../models");
const withAuth = require("../../utils/auth");

// CREATE MEDICATION CARDS /API/PROJECTS
router.post("/", withAuth, async (req, res) => {
  try {
    const newMedication = await Medication.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newMedication);
  } catch (err) {
    res.status(400).json(err);
  }
});


// GET PROJECTS
router.get("/", async (req, res) => {
  try {
    const medications = await Medication.findAll({
      where: { user_id: req.session.user_id },
    });
    res.json(medications);
  } catch (err) {
    console.error({ message: err });
    res.status(500).json(err);
  }
});

// DELETE PROJECTS
router.delete("/:id", async (req, res) => {
  try {
    const medicationData = await Medication.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!medicationData) {
      res.status(404).json({ message: "No project found with this id!" });
      return;
    }

    res.status(200).json(medicationData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
