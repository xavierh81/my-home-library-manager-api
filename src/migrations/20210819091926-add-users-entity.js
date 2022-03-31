module.exports = {
  up: (queryInterface, Sequelize) =>{
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mail: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface,Sequelize) => {
    return queryInterface.dropTable("Users")
  }
};
