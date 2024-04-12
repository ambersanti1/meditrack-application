const router = require("express").Router();
const userRoutes = require("./userRoutes");
const projectRoutes = require('./projectRoutes')
const medRoutes = require('./medRoutes')

router.use("/users", userRoutes);
router.use('/projects', projectRoutes)
router.use('/meds', medRoutes)

module.exports = router;
