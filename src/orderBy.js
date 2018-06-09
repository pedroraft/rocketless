export default (fields, args) => {
    let column = "id";
    let direction = "-";
    if (args && args.order) {
      direction = args.order.charAt(0);
      column = args.order.slice(1);
      // char at 0 isnt direction, assume desc
      if (!["+", "-"].includes(direction)) {
        column = args.order;
        direction = "-";
      }
      if (!Object.keys(fields).includes(column))
        throw new Error(`Order By error, no column named ${column}`);
    }
    return {
      [column]: direction === "-" ? "desc" : "asc"
    };
  }