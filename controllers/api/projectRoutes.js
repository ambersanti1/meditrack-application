const router = require("express").Router();
const { Project } = require("../../models");
const withAuth = require("../../utils/auth");

// CREATE PROJECTS /API/PROJECTS
router.post("/", withAuth, async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET PROJECTS
router.get('/',  async(req, res) => {
  try {
    const projects = await Project.findAll({
      where: { user_id: req.session.user_id },
    });
    res.json(projects)
  } catch (err) {
    console.error({ message: err});
    res.status(500).json(err)
  }
})

// DELETE PROJECTS
router.delete("/:id", async (req, res) => {
  try {
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!projectData) {
      res.status(404).json({ message: "No project found with this id!" });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
