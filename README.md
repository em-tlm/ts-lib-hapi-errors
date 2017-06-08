# ts-hapi-errors

Transforms [Common Errors](https://github.com/tetrascience/ts-lib-errors-node) into a Hapi.js Reply object.

## Usage

1. Reference this module in your `package.json` file's `dependencies`:

  ```sh
  $ npm install tetrascience/ts-hapi-errors -S
  ```

2. Use in a route handler:

  ```js
  const handleError = require('ts-hapi-errors');
  const repository = require('./repository');

  const routeHandler = (req, rep) {
    const reply = rep;
    return repository.get(req.params.id)
      .then((item) => {
        return reply(item);
      })
      .catch((err) => {
        return handleError(err, reply);
      });
  };
  ```

## API

The `ts-hapi-errors` module is just a single function that takes two parameters:

* `err`: a caught error.  If the error is a part of the Common Errors package, an appropriate Hapi.js Response object will be created.  Otherwise, a `500 Server Error` response will be created.

* `reply`: the Hapi.js [reply interface](http://hapijs.com/api#reply-interface) passed to your handler.
