// Load dependencies
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {GraphQLObjectType,GraphQLSchema} = require('graphql')
require('module-alias/register')

// Load all GraphQL schema part
const {queries} = require('@graphql/queries')

// Load models
var models = require('@models')

// Function that configure and start the apollo server
async function startApolloServer() {
  // Construct the schema, using GraphQL schema language 
  let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: queries
    }),
    // mutation: new GraphQLObjectType({
    //   name: 'Mutation',
    //   fields: { ...mutations, ...ordersMutations, ...assistantsMutations, ...posAlertSystemMutations}
    // })
  })

  const server = new ApolloServer({schema});
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

// Sync the Sequelize Model and then start appolo
models.sequelize.sync({force: false}).then(function () {
    // Start the apollo server
    startApolloServer();
})