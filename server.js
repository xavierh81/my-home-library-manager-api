// Load dependencies
const express = require('express');
const jwt = require("express-jwt");
const { ApolloServer, gql } = require('apollo-server-express');
const {GraphQLObjectType,GraphQLSchema} = require('graphql')
var logger = require('morgan');
const cookieParser = require('cookie-parser');

// Register module alias
require('module-alias/register')

// Load all GraphQL schema part
const {queries} = require('@defs_graphql/queries')
const {mutations} = require('@defs_graphql/mutations')

// Load models
var models = require('@models')

// Load helpers
const {formatBytes} = require('@helpers/string')
const {getAuthTokenFromHeader} = require('@helpers/auth')

// Load configuration
var env       = process.env.SERVER_ENV || "local";
var config    = require('@config/config')[env];

// Load middlewares
const userMiddleware = require('@middlewares/UserMiddleware')

// Function that created the apolloServer
function createApolloServer() {
  // Construct the schema, using GraphQL schema language 
  let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: queries
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: mutations
    })
  })

  const server = new ApolloServer({
    schema,
    context: ({ req,res,connection }) => {
      return {
        user: req !== undefined ? req.user : null,
        refreshToken: req !== undefined && req.signedCookies != null ? req.signedCookies.refreshToken : null, 
        res
      }
    }
  });

  return server
}

// Function that configure and start the apollo server
async function startApolloServer() {
  const server = createApolloServer();
  await server.start();

  // Initialize the app
  const app = express();
  app.use(cookieParser(config.auth.server_secret_key));
  app.use(jwt({
    secret: config.auth.server_secret_key,
    algorithms: ["HS256"],
    credentialsRequired: false,
    userProperty: 'token',
    getToken: getAuthTokenFromHeader
  }))

  // Use middlewares
  app.use(userMiddleware)

  // Custom error handling
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.sendStatus(401);
    }
  });

  //
  // Custom logger
  //
  app.use(express.json())
  app.use(express.urlencoded({extended: true}));
  app.use(logger(function (tokens, req, res) {
    // Extract important values
    const url = tokens.url(req, res)
    const method = tokens.method(req, res);
    const operationName = (req.body != null && req.body.operationName != null) ? req.body.operationName : null
    
    const source = req.headers.origin == config.front_url ? "FRONT" : req.headers.origin == config.graphql_explorer_url ? "GraphQL Explorer" : "n/a"

    // If the query come from the GraphQL Explorer, ignore background calls
    if( 
      req.headers.origin == config.graphql_explorer_url
      &&
      ( 
        method == "OPTIONS"
        || operationName == "IntrospectionQuery"
      )
    )
    {
      return;
    }

    // Retrieve user from context
    let user = null

    // Continue to format logs
    return [
      `[${tokens.date(req, res, 'iso')}]`,
      `[${source}]`,
      `[${req.user != null ? `${req.user.mail}` : 'anonymous'}]`,
      `${method}`,
      `${url}`, '-',
  
      operationName, '-',
      
      
      `${tokens.status(req, res)}`,
      `${formatBytes(tokens.res(req, res, 'content-length'))}`,
      `${tokens['response-time'](req, res)}ms`
      
    ].join(' ')
  }));

  // Apply middleware
  server.applyMiddleware({ app });

  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

// if we are in test mode, we just export the server
if(process.env.NODE_ENV == "test")
{
  module.exports.server = createApolloServer();
  module.exports.models = models;
}
// Else we run start the apollo server and listen for requests
else 
{
  // Sync the Sequelize Model and then start appolo
  models.sequelize.sync({force: false}).then(function () {
    // Start the apollo server
    startApolloServer();
  })
}