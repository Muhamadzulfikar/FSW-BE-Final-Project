const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class userNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: 'user_uuid',
        onDelete: 'CASCADE',
      });
    }
  }
  userNotification.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_uuid: DataTypes.UUID,
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_conditional: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'userNotification',
    tableName: 'user_notifications',
  });
  // eslint-disable-next-line no-return-assign, no-param-reassign
  userNotification.beforeCreate((userNotificationUUID) => (userNotificationUUID.uuid = uuidv4()));
  return userNotification;
};
