import { GraphQLList, GraphQLObjectType } from "graphql";
import joinMonster from "join-monster";

import Args from "./args";

export default class Model {
  constructor(knex, fields, options) {
    this.knex = knex;
    this.fields = fields;
    this.options = options;
    this.args = new Args(this.fields);
  }
  
  get graphqlObject() {
    return new GraphQLObjectType({
      name: this.name(),
      sqlTable: this.name(),
      uniqueKey: "id",
      // TODO: clean fields (?)
      fields: this.fields
    });
  }

  get graphqlQuery() {
    return {
      query: {
        type: new GraphQLList(this.graphqlObject),
        resolve: (parent, args, context, resolveInfo) =>
          joinMonster(resolveInfo, context, sql => this.knex.raw(sql), {
            dialect: "pg"
          })
      }
    };
  }

  get name() {
    return this.options.name || this.constructor.name.toLowerCase();
  }
}
