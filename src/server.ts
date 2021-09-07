// Load dependencies
const express = require('express');
const expressJwt = require("express-jwt");
const { ApolloServer, gql } = require('apollo-server-express');
const {GraphQLObjectType,GraphQLSchema} = require('graphql')
var logger = require('morgan');
const cookieParser = require('cookie-parser');
var cors = require('cors');

// Register module alias
require('module-alias/register')

// Load all GraphQL schema part
const queries = require('@defs_graphql/queries').default
const mutations = require('@defs_graphql/mutations').default

// Load models
const db = require('@models/_instance').default

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
    context: ({ req, res }: any) => {
      return {
        user: req !== undefined ? req.user : null,
        refreshToken: req !== undefined && req.signedCookies != null ? req.signedCookies.mhlm_refreshToken : null, 
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

  // CORS
  let corsOptions = {
    origin: [config.front_url, config.graphql_explorer_url],
    methods: "GET, POST, PUT, OPTIONS",
    credentials: true
  }
  app.use(cors(corsOptions));

  // Cookies and auth
  app.use(cookieParser(config.auth.server_secret_key));
  app.use(expressJwt({
    secret: config.auth.server_secret_key,
    algorithms: ["HS256"],
    credentialsRequired: false,
    userProperty: 'token',
    getToken: getAuthTokenFromHeader
  }))

  // Use middlewares
  app.use(userMiddleware)

  // Custom error handling
  app.use(function (err: { name: string; }, req: any, res: any, next: any) {
    if (err.name === 'UnauthorizedError') {
      res.sendStatus(401);
    }
  });

  //
  // Custom logger
  //
  app.use(express.json())
  app.use(express.urlencoded({extended: true}));
  app.use(logger(function (tokens: any, req: any, res: any) {
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
  server.applyMiddleware({ app, cors: corsOptions });

  await new Promise(resolve => app.listen({ port: 4002 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4002${server.graphqlPath}`);
  return { server, app };
}

// if we are in test mode, we just export the server
if(process.env.NODE_ENV == "test")
{
  module.exports.server = createApolloServer();
  module.exports.db = db;
}
// Else we run start the apollo server and listen for requests
else 
{
  // Sync the Sequelize Model and then start apollo
  db.sequelize.sync({force: false}).then(function () {
    // Start the apollo server
    startApolloServer();
  })
}