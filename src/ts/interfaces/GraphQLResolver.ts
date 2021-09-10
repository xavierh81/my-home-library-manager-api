/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLList, GraphQLObjectType, GraphQLResolveInfo } from "graphql";
import { QueryContext } from "@interfaces/QueryContext";

export type GraphQLResolver = {
    type: GraphQLObjectType | GraphQLList<any>;
    args?: any,
    resolve: (_root: unknown, args: any, context: QueryContext, _info: GraphQLResolveInfo) => Promise<any>
}

export type GraphQLResolvers = {
    
}