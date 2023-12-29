/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_courses', {
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
      user_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      course_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'courses',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      is_onboarding: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('user_courses');
  },
};
