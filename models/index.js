const User = require('./User')
const Project = require('./Project')
const Med = require('./Med')

User.hasMany(Project, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})

User.hasMany(Med, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})

Project.belongsTo(User, {
  foreignKey: 'user_id'
});


Med.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Project, Med};