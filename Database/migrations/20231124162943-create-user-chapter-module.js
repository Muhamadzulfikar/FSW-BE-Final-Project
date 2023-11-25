/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_chapter_modules', {
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
      chapter_module_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'chapter_module',
          key: 'uuid',
        },
      },
      user_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'user',
          key: 'uuid',
        },
      },
      is_complete: {
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
    await queryInterface.dropTable('user_chapter_modules');
  },
};
