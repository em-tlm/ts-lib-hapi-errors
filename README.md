# ts-hapi-errors

Transforms [Common Errors](https://github.com/tetrascience/ts-lib-errors-nodejs) into a Boom error object.

**Note:** This release is compatible with Hapi 17+. For older version check previous releases.

## Usage

1. Reference this module in your `package.json` file's `dependencies`:

  ```sh
  $ npm install tetrascience/ts-lib-hapi-errors -S
  ```

2. Use in a route handler:

  ```JavaScript
  const handleError = require('ts-hapi-errors');
  const repository = require('./repository');

  const routeHandler = async (request, h) {
    try {
      return repository.get(request.params.id);
    } catch (err) {
      return handleError(err);
    }
  };
  ```

## API

The `ts-lib-hapi-errors` module is just a single function that takes one parameter:

* `err`: a caught error. If the error is a part of the Common Errors package, an appropriate Boom object will be created.  Otherwise, a `500 Server Error` response will be created.
