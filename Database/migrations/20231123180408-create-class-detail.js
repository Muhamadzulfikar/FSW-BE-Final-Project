/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      class_uuid: {
        type: Sequelize.UUID,
      },
      description: {
        type: Sequelize.STRING,
      },
      class_target: {
        type: Sequelize.JSON,
      },
      telegram: {
        type: Sequelize.STRING,
      },
      onboarding: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('class_details');
  },
};
