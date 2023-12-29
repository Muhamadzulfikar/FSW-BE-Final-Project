/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_course_payments', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
      },
      user_course_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'user_courses',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM('credit card', 'bank transfer'),
        allowNull: true,
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user_course_payments');
  },
};
