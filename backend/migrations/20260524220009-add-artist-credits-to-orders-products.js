'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders_products', 'artist_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('orders_products', 'artist_bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('orders_products', 'music_url', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders_products', 'artist_name');
    await queryInterface.removeColumn('orders_products', 'artist_bio');
    await queryInterface.removeColumn('orders_products', 'music_url');
  }
};