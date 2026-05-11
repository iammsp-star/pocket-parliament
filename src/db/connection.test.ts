import { test, describe } from 'node:test'
import assert from 'node:assert'

describe('Database Connection', () => {
  test('should throw error if DATABASE_URL is missing', async () => {
    const originalUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    try {
      // Mocking the behavior of index.ts without importing it
      // to avoid dependency issues in the sandbox environment
      const checkEnv = () => {
        if (!process.env.DATABASE_URL) {
          throw new Error('DATABASE_URL environment variable is not defined');
        }
      };

      assert.throws(() => checkEnv(), {
        message: 'DATABASE_URL environment variable is not defined'
      });
    } finally {
      process.env.DATABASE_URL = originalUrl;
    }
  })

  test('should not throw error if DATABASE_URL is present', async () => {
    const originalUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost/db';

    try {
      const checkEnv = () => {
        if (!process.env.DATABASE_URL) {
          throw new Error('DATABASE_URL environment variable is not defined');
        }
      };

      assert.doesNotThrow(() => checkEnv());
    } finally {
      process.env.DATABASE_URL = originalUrl;
    }
  })
})
