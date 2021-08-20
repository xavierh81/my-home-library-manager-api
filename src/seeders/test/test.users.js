
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          mail: "test_user@mail.com",
          password: "e19d5cd5af0378da05f63f891c7467af", // abcd1234
          firstName: "Test",
          lastName: "User 1",
          refreshToken: "7bcba561-6f27-4c6f-95b7-c68cc1bc5923",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          mail: "test_user_2@mail.com",
          password: "35e5ff80657b6744d43021c23043346d", // abcd5678
          firstName: "Test",
          lastName: "User 2",
          refreshToken: "3688beb5-55b1-4332-a711-1a94b19c8649",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),
  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
};