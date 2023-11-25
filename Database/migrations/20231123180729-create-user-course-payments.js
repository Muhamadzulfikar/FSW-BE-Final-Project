/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_course_payments', {
      id: {
        allowNull: false,
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
      },
      payment_method: {
        type: Sequelize.ENUM('credit card', 'bank transfer'),
        allowNull: false,
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user_course_payments');
  },
};
