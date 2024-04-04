const User = require('./User')
const Project = require('./Project')
const Medication = require('./Medication')

User.hasMany(Project, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})
User.hasMany(Medication, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})

Project.belongsTo(User, {
  foreignKey: 'user_id'
});

Medication.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Project, Medication};