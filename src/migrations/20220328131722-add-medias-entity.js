'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>{
    return queryInterface.createTable("Medias", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      type:{
        type: Sequelize.SMALLINT,
        allowNull: false
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
           notEmpty: true
        }
      },
      originalTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      releaseDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      searchSource: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      searchSourceMediaId: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
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

  down: async (queryInterface) => {
    return queryInterface.dropTable("Medias")
  }
};
