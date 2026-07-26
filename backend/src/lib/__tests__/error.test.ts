import { describe, it, expect } from 'vitest';
import { AppError } from '../error.js';

describe('AppError', () => {
  describe('constructor', () => {
    it('creates an error with the given status code and message', () => {
      const err = new AppError(418, 'Teapot');
      expect(err.statusCode).toBe(418);
      expect(err.message).toBe('Teapot');
    });

    it('sets name to AppError', () => {
      const err = new AppError(500, 'Oops');
      expect(err.name).toBe('AppError');
    });

    it('is an instance of both Error and AppError', () => {
      const err = new AppError(400, 'Bad');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(AppError);
    });

    it('captures a stack trace', () => {
      const err = new AppError(500, 'fail');
      expect(err.stack).toBeDefined();
      expect(err.stack).toContain('AppError');
    });
  });

  describe('BadRequest', () => {
    it('returns 400 with the given message', () => {
      const err = AppError.BadRequest('Invalid input');
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe('Invalid input');
    });
  });

  describe('Unauthorized', () => {
    it('returns 401 with a default message', () => {
      const err = AppError.Unauthorized();
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Unauthorized');
    });

    it('returns 401 with a custom message', () => {
      const err = AppError.Unauthorized('Token expired');
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Token expired');
    });
  });

  describe('Forbidden', () => {
    it('returns 403 with a default message', () => {
      const err = AppError.Forbidden();
      expect(err.statusCode).toBe(403);
      expect(err.message).toBe('Forbidden');
    });

    it('returns 403 with a custom message', () => {
      const err = AppError.Forbidden('Insufficient permissions');
      expect(err.statusCode).toBe(403);
      expect(err.message).toBe('Insufficient permissions');
    });
  });

  describe('NotFound', () => {
    it('returns 404 with a default message', () => {
      const err = AppError.NotFound();
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Not Found');
    });

    it('returns 404 with a custom message', () => {
      const err = AppError.NotFound('User not found');
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('User not found');
    });
  });

  describe('Conflict', () => {
    it('returns 409 with the given message', () => {
      const err = AppError.Conflict('Email already exists');
      expect(err.statusCode).toBe(409);
      expect(err.message).toBe('Email already exists');
    });
  });

  describe('Internal', () => {
    it('returns 500 with a default message', () => {
      const err = AppError.Internal();
      expect(err.statusCode).toBe(500);
      expect(err.message).toBe('Internal Server Error');
    });

    it('returns 500 with a custom message', () => {
      const err = AppError.Internal('Database connection failed');
      expect(err.statusCode).toBe(500);
      expect(err.message).toBe('Database connection failed');
    });
  });
});
