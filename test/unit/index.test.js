'use strict';

const assert = require('chai').assert;
const errors = require('ts-errors');

const handleError = require('../../lib');
const reply = require('../mocks/reply');


describe('#handleError', () => {
  const CT = 'content-type';
  const JT = 'application/json';

  it('should throw if e is not an object', () => {
    assert.throws(() => {
      handleError(123, reply);
    }, TypeError);
  });

  it('should throw if e is null', () => {
    assert.throws(() => {
      handleError(null, reply);
    }, TypeError);
  });

  it('should throw if reply is not a function', () => {
    assert.throws(() => {
      handleError({ message: 'test' }, 123);
    }, TypeError);
  });

  describe('FormatError', () => {
    it('should create a 400 reply', () => {
      const e = new errors.FormatError();
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 400);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.FormatError();
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.FormatError();
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.FormatError();
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.FormatError();
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should not have any other keys than message', () => {
      const e = new errors.FormatError();
      const res = handleError(e, reply);
      const keys = Object.keys(res.payload);
      assert.strictEqual(keys.length, 1);
      assert.strictEqual(keys[0], 'message');
    });
  });

  describe('ValidationError', () => {
    it('should create a 400 reply', () => {
      const e = new errors.ValidationError();
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 400);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.ValidationError();
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.ValidationError();
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.ValidationError();
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.ValidationError();
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should have payload with a data key', () => {
      const e = new errors.ValidationError();
      const res = handleError(e, reply);
      assert.property(res.payload, 'data');
    });

    it('should have payload with a data key equal to data for error', () => {
      const e = new errors.ValidationError(123);
      const res = handleError(e, reply);
      assert.strictEqual(res.payload.data, 123);
    });

    it('should not have any other keys than message or data', () => {
      const e = new errors.ValidationError();
      const res = handleError(e, reply);
      const keys = Object.keys(res.payload);
      assert.strictEqual(keys.length, 2);
      assert.include(keys, 'message');
      assert.include(keys, 'data');
    });
  });

  describe('CredentialsError', () => {
    const WWWA_KEY = 'www-authenticate';
    const WWWA = 'digest';

    it('should create a 401 reply', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 401);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should throw if e.data is not a string', () => {
      assert.throws(() => {
        const e = new errors.CredentialsError(undefined, 42);
        handleError(e, reply);
      }, TypeError);
    });

    it('should create WWW-Authenticate header', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const res = handleError(e, reply);
      assert.property(res.headers, WWWA_KEY);
    });

    it('should create WWW-Authenticate header equal to e.data', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[WWWA_KEY], WWWA);
    });

    it('should not have any other keys than message', () => {
      const e = new errors.CredentialsError(undefined, WWWA);
      const res = handleError(e, reply);
      const keys = Object.keys(res.payload);
      assert.strictEqual(keys.length, 1);
      assert.strictEqual(keys[0], 'message');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create a 403 reply', () => {
      const e = new errors.UnauthorizedError();
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 403);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.UnauthorizedError();
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.UnauthorizedError();
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.UnauthorizedError();
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.UnauthorizedError();
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should not have any other keys than message', () => {
      const e = new errors.UnauthorizedError();
      const res = handleError(e, reply);
      const keys = Object.keys(res.payload);
      assert.strictEqual(keys.length, 1);
      assert.strictEqual(keys[0], 'message');
    });
  });

  describe('NotFoundError', () => {
    it('should create a 404 reply', () => {
      const e = new errors.NotFoundError();
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 404);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.NotFoundError();
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.NotFoundError();
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.NotFoundError();
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.NotFoundError();
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should not have any other keys than message', () => {
      const e = new errors.NotFoundError();
      const res = handleError(e, reply);
      const keys = Object.keys(res.payload);
      assert.strictEqual(keys.length, 1);
      assert.strictEqual(keys[0], 'message');
    });
  });

  describe('ConcurrencyError', () => {
    it('should create a 409 reply', () => {
      const e = new errors.ConcurrencyError();
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 409);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.ConcurrencyError();
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.ConcurrencyError();
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.ConcurrencyError();
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.ConcurrencyError();
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should include data if included in the error', () => {
      const e = new errors.ConcurrencyError(123);
      const res = handleError(e, reply);
      assert.property(res.payload, 'data');
    });
  });

  describe('ExistsError', () => {
    it('should create a 409 reply', () => {
      const e = new errors.ExistsError();
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 409);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.ExistsError();
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.ExistsError();
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.ExistsError();
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.ExistsError();
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should include data if included in the error', () => {
      const e = new errors.ExistsError(123);
      const res = handleError(e, reply);
      assert.property(res.payload, 'data');
    });
  });

  describe('TempUnavailableError', () => {
    it('should create a 503 reply', () => {
      const e = new errors.TempUnavailableError();
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 503);
    });

    it('should have JSON Content-Type', () => {
      const e = new errors.TempUnavailableError();
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = new errors.TempUnavailableError();
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = new errors.TempUnavailableError();
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = new errors.TempUnavailableError();
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should not have any other keys than message', () => {
      const e = new errors.TempUnavailableError();
      const res = handleError(e, reply);
      const keys = Object.keys(res.payload);
      assert.strictEqual(keys.length, 1);
      assert.strictEqual(keys[0], 'message');
    });
  });

  describe('Default', () => {
    it('should create a 500 reply', () => {
      const e = { message: 'Default' };
      const res = handleError(e, reply);
      assert.strictEqual(res.statusCode, 500);
    });

    it('should have JSON Content-Type', () => {
      const e = { message: 'Default' };
      const res = handleError(e, reply);
      assert.strictEqual(res.headers[CT], JT);
    });

    it('should have an object payload', () => {
      const e = { message: 'Default' };
      const res = handleError(e, reply);
      assert.isObject(res.payload);
    });

    it('should have payload with a message key', () => {
      const e = { message: 'Default' };
      const res = handleError(e, reply);
      assert.property(res.payload, 'message');
    });

    it('should have payload with a message key that is a string', () => {
      const e = { message: 'Default' };
      const res = handleError(e, reply);
      assert.isString(res.payload.message);
    });

    it('should not have any other keys than message', () => {
      const e = { message: 'Default' };
      const res = handleError(e, reply);
      const keys = Object.keys(res.payload);
      assert.strictEqual(keys.length, 1);
      assert.strictEqual(keys[0], 'message');
    });
  });
});
