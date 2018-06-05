export default class Context {
    constructor(req) {
      this.req = req;
      this.context = {};
    }
  
    // maybe use chaining
    authenticate(options) {
      const token = this.req.headers.authorization;
      if (!token) return this;
      // TODO: auth logic
      return this;
    }
  }
  