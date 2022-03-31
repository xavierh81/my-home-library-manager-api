// Imports
import {GraphQLScalarType, Kind} from 'graphql'
import moment from 'moment'

// Define all types
function fromISODate(value: string) { 
    try {
        if (!value) return null;

        return new Date(value);
    }
    catch(e) {
        return null;
    }
} 

function toISODate(d: Date) {
    if (!d) return null;
    if ((d instanceof Date)) {
        let m = moment(d)
        return m.valueOf()
    }
    return d;
 }

export const GraphQLDate = new GraphQLScalarType({ 
    name: 'Date', 
    description: 'Custom Date Type', 
    serialize: toISODate, 
    parseValue: fromISODate, 
    parseLiteral(ast) { 
        if (ast.kind === Kind.INT) {
            return new Date(ast.value); 
        }
    }
});