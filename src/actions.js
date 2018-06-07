const create = async (knex, tableName, args) => {
  const id = await knex(tableName)
    .insert({ ...args })
    .returning("id");
  return knex(tableName)
    .where({ id: id[0] })
    .first();
};

const del = async (knex, tableName, id) =>
  knex(tableName)
    .where(id)
    .del();
    
const update = async (knex, tableName, modelFields, args) => {
  if (!args || !args.id) throw new Error("no id");
  let updateObj = {};
  Object.keys(args).forEach(key => {
    if (key === "id") return;
    if (modelFields.updated_at) updateObj.updated_at = new Date();
    updateObj = { ...updateObj, [key]: args[key] };
  });
  // this should be else where
  // this.validate(updateObj);
  if (updateObj.length === 0) throw new Error("no args to update");
  const updated = await knex(tableName)
    .update(updateObj)
    .where("id", args.id);
  if (!updated) throw new Error("error updating");
  return knex(tableName)
    .where("id", args.id)
    .first();
};

export { create, del, update };
