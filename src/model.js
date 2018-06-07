import { GraphQLList, GraphQLObjectType } from "graphql";
import joinMonster from "join-monster";

import Args from "./args";
import {create, del, update} from "./actions";

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

  get GraphqlMutation() {
    return {
      [`create${this.name}`]: {
        type: this.graphqlObject,
        args: this.args.create(),
        resolve: (parent, args) => this.create(args)
      },
      [`update${this.name}`]: {},
      [`delete${this.name}`]: {},
    };
  }

  get name() {
    return this.options.name || this.constructor.name.toLowerCase();
  }

  async create(args) {
    return create(this.knex, this.name, args);
  }

  async update(args) {
    return update(this.knex, this.name, this.fields, args);
  }

  async del(id) {
    return del(this.knex, this.name, id);
  }
}
