const router = require("express").Router();
const userRoutes = require("./userRoutes");
const projectRoutes = require('./projectRoutes')
const medicationRoutes = require('./medicationRoutes')

router.use("/users", userRoutes);
router.use('/projects', projectRoutes)
router.use('/medications', medicationRoutes)

module.exports = router;
