/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('otp_users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
      },
      user_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
      },
      otp_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      expiredAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('otp_users');
  },
};
