"use strict";
const moment = require("moment");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "books",
      [
        {
          title: "Sebuah Seni Bersikap Bodoh Amat",
          publicationDate: moment("12/12/2020").format("YYYY-MM-DD"),
          pages: 240,
          ISBN: 9786020391111,
          author: "Mark Manson",
          price: 59000,
          description: "Selama beberapa tahun belakangan...",
          bookAttachment: "sebuah-seni-bersikap-bodoh-amat.pdf",
          thumbnail: "sebuah-seni-bersikap-bodoh-amat.png",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("books", null, {});
  },
};
