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
      });
    }
  }
  userNotification.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    user_uuid: DataTypes.STRING,
    tittle: DataTypes.STRING,
    is_conditional: DataTypes.BOOLEAN,
    is_read: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'userNotification',
    tableName: 'user_notifications',
  });
  // eslint-disable-next-line no-return-assign, no-param-reassign
  userNotification.beforeCreate((userNotificationUUID) => (userNotificationUUID.uuid = uuidv4()));
  return userNotification;
};
