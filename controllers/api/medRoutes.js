const router = require("express").Router();
const { Med } = require("../../models");
const withAuth = require("../../utils/auth");

// CREATE MED CARDS /API/PROJECTS
router.post("/", async (req, res) => {
  try {
    const newMed = await Med.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newMed);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET PROJECTS
router.get("/", async (req, res) => {
  try {
    const Meds = await Med.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });
    res.json(Meds);
  } catch (err) {
    console.error({ message: err });
    res.status(500).json(err);
  }
});
// DELETE PROJECTS
router.delete("/:id", async (req, res) => {
  try {
    const MedData = await Med.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!MedData) {
      res.status(404).json({ message: "No project found with this id!" });
      return;
    }

    res.status(200).json(MedData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
