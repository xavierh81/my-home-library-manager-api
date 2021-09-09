/* eslint-disable @typescript-eslint/no-explicit-any */
// Load dependencies
import 'module-alias/register';
import express from 'express';
import expressJwt from "express-jwt"
import { ApolloServer } from 'apollo-server-express'
import {GraphQLObjectType,GraphQLSchema} from 'graphql'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Load all GraphQL schema part
import queries from '@defs_graphql/queries'
import mutations from '@defs_graphql/mutations'

// Load models
import db from '@models/_instance'

// Load helpers
import {loadConfig} from '@helpers/global'
import {formatBytes} from '@helpers/string'
import {getAuthTokenFromHeader} from '@helpers/auth'

// Load configuration
const config = loadConfig();

// Load middlewares
import userMiddleware from '@middlewares/UserMiddleware'

// Declare variables / constants
let apolloServer : ApolloServer<any> | null = null;

// Function that created the apolloServer
function createApolloServer() {
  // Construct the schema, using GraphQL schema language 
  const schema = new GraphQLSchema({
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
      console.log("Server - Context - Define")
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
  const corsOptions = {
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

    next()
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

  await new Promise(resolve => app.listen({ port: 4002 }, () => resolve(true)));

  console.log(`🚀 Server ready at http://localhost:4002${server.graphqlPath}`);
  return { server, app };
}

// if we are in test mode, we just export the server
if(process.env.NODE_ENV == "test")
{
  apolloServer = createApolloServer();
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

// Exports
// Note: it's used for tests files
const runningServer = {
  server: apolloServer,
  db
}

export default runningServer