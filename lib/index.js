const { coalesce } = require('elv');
const errors = require('ts-errors');
const Boom = require('boom');

module.exports = function handleError(err) {
  if (typeof err !== 'object') {
    throw new TypeError('The argument "err" must be an object.');
  }

  if (Boom.isBoom(err)) {
    return err;
  }

  if (err === null) {
    throw new TypeError('The argument "err" cannot be null.');
  }

  let response;
  if (err instanceof errors.CredentialsError || err.name === 'CredentialsError') {
    if (typeof err.data !== 'string') {
      throw new TypeError('No "data" property provided for specifying auth.');
    }

    response = Boom.unauthorized(
      coalesce(err.message, errors.CredentialsError.defaultMessage),
      err.data
    );
  } else if (err instanceof errors.ConcurrencyError || err.name === 'ConcurrencyError') {
    response = Boom.conflict(
      coalesce(err.message, errors.ConcurrencyError.defaultMessage),
      err.data || {}
    );
  } else if (err instanceof errors.ExistsError || err.name === 'ExistsError') {
    response = Boom.conflict(
      coalesce(err.message, errors.ExistsError.defaultMessage),
      err.data || {}
    );
  } else if (err instanceof errors.FormatError || err.name === 'FormatError') {
    response = Boom.badRequest(
      coalesce(err.message, errors.FormatError.defaultMessage)
    );
  } else if (err instanceof errors.NotFoundError || err.name === 'NotFoundError') {
    response = Boom.notFound(
      coalesce(err.message, errors.NotFoundError.defaultMessage)
    );
  } else if (err instanceof errors.TempUnavailableError || err.name === 'TempUnavailableError') {
    response = Boom.serverUnavailable(
      coalesce(err.message, errors.TempUnavailableError.defaultMessage)
    );
  } else if (err instanceof errors.UnauthorizedError || err.name === 'UnauthorizedError') {
    response = Boom.forbidden(
      coalesce(err.message, errors.UnauthorizedError.defaultMessage)
    );
  } else if (err instanceof errors.ValidationError || err.name === 'ValidationError') {
    response = Boom.badRequest(
      coalesce(err.message, errors.ValidationError.defaultMessage),
      err.data || {}
    );
  } else {
    response = Boom.badImplementation(
      coalesce(err.message, 'An unspecified error has occurred.')
    );
  }

  response.output.headers['content-type'] = 'application/json';
  return response;
};
