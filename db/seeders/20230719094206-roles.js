'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let [template, func] = await queryInterface.sequelize.query(`Select count(*) from "Roles"`);

    if(template[0]?.count <= 0){
     queryInterface.bulkInsert("Roles", [
      {
        name: 'admin',
        status:true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user',
        status:true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
    );
  }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Roles", null, {});
  }
};
