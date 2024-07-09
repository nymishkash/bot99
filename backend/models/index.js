const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Conversation = sequelize.define('Conversation', {
  userMessage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  botMessage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  functionMessage: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

sequelize.sync();

module.exports = {
  sequelize,
  Conversation
};
