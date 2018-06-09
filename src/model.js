import { GraphQLList, GraphQLString, GraphQLObjectType } from "graphql";
import joinMonster from "join-monster";
import { connectionDefinitions } from "graphql-relay";

import Args from "./args";
import orderBy from "./orderBy";
import { create, del, update } from "./actions";

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

  get connectionType() {
    const { connectionType: objConnection } = connectionDefinitions({
      nodeType: this.graphqlObject
    });
    return objConnection;
  }

  get graphqlQuery() {
    return {
      [this.name]: {
        type: new GraphQLList(this.graphqlObject), // TODO: relay uses connectionType
        order: {
          type: GraphQLString
        },
        orderBy: args => this.orderBy(args),
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
      [`update${this.name}`]: {
        type: this.graphqlObject,
        args: this.args.update(),
        resolve: (parent, args) => this.update(args)
      },
      [`delete${this.name}`]: {
        type: this.graphqlObject,
        args: this.args.onlyId(),
        resolve: (parent, args) => this.del(args)
      }
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

  orderBy(args) {
    return orderBy(this.fields, args);
  }
}
