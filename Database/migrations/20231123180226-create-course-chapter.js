/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_chapter', {
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
      chapter: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.STRING,
      },
      is_free: {
        type: Sequelize.BOOLEAN,
        references: {
          model: 'user',
          key: 'createdAt',
        },
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
    await queryInterface.dropTable('course_chapter');
  },
};
