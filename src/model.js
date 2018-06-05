import { GraphQLList, GraphQLObjectType } from "graphql";
import joinMonster from "join-monster";

export default class Model {
  constructor(knex, fields, options) {
    this.knex = knex;
    this.fields = fields;
    this.options = options;
    this.graphqlObject = {};
    this.graphqlQuery = {};
    this.build();
  }

  build() {
    this.buildGraphqlObject();
  }

  buildGraphqlObject() {
    this.graphqlObject = new GraphQLObjectType({
      name: this.getName(),
      sqlTable: this.getName(),
      uniqueKey: "id",
      // TODO: clean fields (?)
      fields: this.fields
    });
  }

  makeGraphqlQuery() {
    this.graphqlQuery = {
      query: {
        type: new GraphQLList(this.graphqlObject),
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster(resolveInfo, context, sql => this.knex.raw(sql), {
            dialect: "pg"
          });
        }
      }
    };
  }

  getName() {
    return this.options.name || this.constructor.name.toLowerCase();
  }
}
