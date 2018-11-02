const { describe, it } = require('mocha');
const { assert } = require('chai');
const Boom = require('boom');
const errors = require('ts-errors');

const handleError = require('../../lib');

describe('#handleError', () => {
  const CT = 'content-type';
  const JT = 'application/json';

  it('should throw if e is not an object', () => {
    assert.throws(() => {
      handleError(123);
    }, TypeError);
  });

  it('should throw if e is null', () => {
    assert.throws(() => {
      handleError(null);
    }, TypeError);
  });

  it('should handle Boom error', () => {
    const err = Boom.badRequest();
    assert.strictEqual(handleError(err), err);
  });

  describe('FormatError', () => {
    it('should create a 400 reply', () => {
      const e = new errors.FormatError();
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 400);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.FormatError();
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.FormatError();
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.FormatError();
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.FormatError();
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });
  });

  describe('ValidationError', () => {
    it('should create a 400 reply', () => {
      const e = new errors.ValidationError();
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 400);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.ValidationError();
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.ValidationError();
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.ValidationError();
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.ValidationError();
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });

    it('should have payload with a data key', () => {
      const e = new errors.ValidationError();
      const result = handleError(e);
      assert.property(result, 'data');
    });

    it('should have payload with a data key equal to data for error', () => {
      const e = new errors.ValidationError(123);
      const { data } = handleError(e);
      assert.strictEqual(data, 123);
    });
  });

  describe('CredentialsError', () => {
    const WWWA_KEY = 'WWW-Authenticate';
    const WWWA = 'digest';

    it('should create a 401 reply', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 401);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });

    it('should throw if e.data is not a string', () => {
      assert.throws(() => {
        const e = new errors.CredentialsError(undefined, 42);
        handleError(e);
      }, TypeError);
    });

    it('should create WWW-Authenticate header', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const { output } = handleError(e);
      assert.property(output.headers, WWWA_KEY);
    });

    it('should create WWW-Authenticate header equal to e.data', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const { output } = handleError(e);
      assert.include(output.headers[WWWA_KEY], WWWA);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create a 403 reply', () => {
      const e = new errors.UnauthorizedError();
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 403);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.UnauthorizedError();
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.UnauthorizedError();
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.UnauthorizedError();
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.UnauthorizedError();
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });
  });

  describe('NotFoundError', () => {
    it('should create a 404 reply', () => {
      const e = new errors.NotFoundError();
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 404);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.NotFoundError();
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.NotFoundError();
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.NotFoundError();
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.NotFoundError();
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });
  });

  describe('ConcurrencyError', () => {
    it('should create a 409 reply', () => {
      const e = new errors.ConcurrencyError();
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 409);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.ConcurrencyError();
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.ConcurrencyError();
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.ConcurrencyError();
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.ConcurrencyError();
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });

    it('should include data if included in the error', () => {
      const e = new errors.ConcurrencyError(123);
      const result = handleError(e);
      assert.property(result, 'data');
    });
  });

  describe('ExistsError', () => {
    it('should create a 409 reply', () => {
      const e = new errors.ExistsError();
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 409);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.ExistsError();
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.ExistsError();
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.ExistsError();
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.ExistsError();
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });

    it('should include data if included in the error', () => {
      const e = new errors.ExistsError(123);
      const response = handleError(e);
      assert.property(response, 'data');
    });
  });

  describe('TempUnavailableError', () => {
    it('should create a 503 reply', () => {
      const e = new errors.TempUnavailableError();
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 503);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.TempUnavailableError();
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.TempUnavailableError();
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.TempUnavailableError();
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.TempUnavailableError();
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });
  });

  describe('Default', () => {
    it('should create a 500 reply', () => {
      const e = { message: 'Default' };
      const { output } = handleError(e);
      assert.strictEqual(output.statusCode, 500);
    });

    it('should have JSON Content-Type', () => {
      const e = { message: 'Default' };
      const { output } = handleError(e);
      assert.strictEqual(output.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = { message: 'Default' };
      const { output } = handleError(e);
      assert.isObject(output.payload);
    });

    it('should have payload with a message key', () => {
      const e = { message: 'Default' };
      const { output } = handleError(e);
      assert.property(output.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = { message: 'Default' };
      const { output } = handleError(e);
      assert.isString(output.payload.message);
    });
  });
});
