'use strict';

const elv = require('elv');


class Response {
  constructor(code, payload) {
    this.statusCode = elv.coalesce(code, 200);
    this.payload = payload;
    this.headers = {};
    this.settings = {
      charset: 'utf-8',
      encoding: 'utf8',
      passThrough: true,
      stringify: {},
      varyEtag: false,
    };
  }

  code(statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  header(name, value, options) {
    this.headers[name] = value;
    return this;
  }

  type(mimeType) {
    this.headers['content-type'] = mimeType;
    return this;
  }
}


module.exports = function(result) {
  const code = (result instanceof Error) ? 500 : 200;
  return new Response(code, result);
};
