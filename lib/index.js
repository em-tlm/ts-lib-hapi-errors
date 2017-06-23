'use strict';

const coalesce = require('elv').coalesce;
const errors = require('ts-errors');


module.exports = function(err, reply) {
  if (typeof err !== 'object') {
    throw new TypeError('The argument "err" must be an object.');
  }

  if (err === null) {
    throw new TypeError('The argument "err" cannot be null.');
  }

  if (typeof reply !== 'function') {
    throw new TypeError('The argument "reply" must be a function.');
  }

  if (err instanceof errors.CredentialsError || err.name === 'CredentialsError') {
    if (typeof err.data !== 'string')
      throw new TypeError('No "data" property provided for specifying auth.');

    return reply({
      message: coalesce(err.message, errors.CredentialsError.defaultMessage)
    }).type('application/json').code(401).header('www-authenticate', err.data);
  }

  if (err instanceof errors.ConcurrencyError || err.name === 'ConcurrencyError') {
    return reply({
      message: coalesce(err.message, errors.ConcurrencyError.defaultMessage),
      data: coalesce(err.data, {})
    }).type('application/json').code(409);
  }

  if (err instanceof errors.ExistsError || err.name === 'ExistsError') {
    return reply({
      message: coalesce(err.message, errors.ExistsError.defaultMessage),
      data: coalesce(err.data, {})
    }).type('application/json').code(409);
  }

  if (err instanceof errors.FormatError || err.name === 'FormatError') {
    return reply({
      message: coalesce(err.message, errors.FormatError.defaultMessage)
    }).type('application/json').code(400);
  }

  if (err instanceof errors.NotFoundError
      || err.name === 'NotFoundError') {
    return reply({
      message: coalesce(err.message, errors.NotFoundError.defaultMessage)
    }).type('application/json').code(404);
  }

  if (err instanceof errors.TempUnavailableError || err.name === 'TempUnavailableError') {
    return reply({
      message: coalesce(err.message, errors.TempUnavailableError.defaultMessage)
    }).type('application/json').code(503);
  }

  if (err instanceof errors.UnauthorizedError || err.name === 'UnauthorizedError') {
    return reply({
      message: coalesce(err.message, errors.UnauthorizedError.defaultMessage)
    }).type('application/json').code(403);
  }

  if (err instanceof errors.ValidationError || err.name === 'ValidationError') {
    return reply({
      message: coalesce(err.message, errors.ValidationError.defaultMessage),
      data: coalesce(err.data, {})
    }).type('application/json').code(400);
  }

  return reply({
    message: coalesce(err.message, 'An unspecified error has occurred.')
  }).type('application/json').code(500);
};
