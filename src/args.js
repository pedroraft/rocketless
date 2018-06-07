import { getNullableType } from "graphql";

export default class Args {
  constructor(fields) {
    this.fields = fields;
  }

  static ignoreFields(key, ignore) {
    let list = ["created_id", "updated_id"];
    list = ignore ? [...list, ...ignore] : list;
    return list.includes(key);
  }

  /**
   * transforms fields definitions into args
   */
  get args() {
    let args = {};
    Object.keys(this.fields).forEach(key => {
      const field = this.fields[key];
      const { type } = field;
      const arg = { [key]: { type } };
      args = { ...args, ...arg };
    });
    return args;
  }

  /**
   * For partial update fields should be nullable;
   * id field still required to find the row to update
   * TODO: snafu
   */
  get argsUpdate() {
    const args = this.getArgs();
    Object.keys(args).forEach(key => {
      if (Args.ignoreFields(key)) delete args[key];
      if (key === "id") return;
      // getNullableType not working, no ideia why
      // only attempt to fix with >= 1.21 gigawatts of patience
      // cursing may help
      args[key] = getNullableType(args[key]);
    });
    return args;
  }

  /**
   * gets all the args minus the id
   */
  get argsCreate() {
    const args = this.getArgs();
    Object.keys(args).forEach(key => {
      if (Args.ignoreFields(key, ["id"])) delete args[key];
    });
    return args;
  }

  /**
   * returns only the id field args
   */
  get argsOnlyId() {
    const args = this.getArgs();
    if (args.id) return { id: args.id };
    throw new Error("id not found");
  }
}
