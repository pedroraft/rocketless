import Model from "../../src/model";
import { GraphQLString, GraphQLInt, GraphQLBoolean } from "graphql";

export default class Todo extends Model {
  constructor(knex) {
    super(knex, {
      id: {
        type: GraphQLInt
        // ...globalIdField()
      },
      name: {
        type: GraphQLString,
        validate: { length: { maximum: 500 } }
      },
      complete: {
        type: GraphQLBoolean
      }
    });
  }
}

const database = knex();

const todo = new Todo(database);

const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    ...todo.graphqlQuery
  })
});

const schema = new GraphQLSchema({ query });
const graphqlHandler = graphqlLambda({ schema });
const graphiqlHandler = graphiqlLambda({ endpointURL: "/graphql" });
