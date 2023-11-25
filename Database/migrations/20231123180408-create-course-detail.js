/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      course_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'course',
          key: 'uuid',
        },
      },
      description: {
        type: Sequelize.STRING,
      },
      class_target: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      telegram: {
        type: Sequelize.STRING,
      },
      onboarding: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('course_details');
  },
};
