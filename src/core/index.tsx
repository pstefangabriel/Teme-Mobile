export const baseUrl = 'localhost:3000';

export { getLogger } from './logger';

import { getLogger as _getLogger } from './logger';
const log = _getLogger('api');

export interface ResponseProps<T> {
  data: T;
}

export function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
  log(`${fnName} - started`);
  return promise
    .then(res => {
      log(`${fnName} - succeeded`);
      return Promise.resolve(res.data);
    })
    .catch(err => {
      log(`${fnName} - failed`, err);
      return Promise.reject(err);
    });
}

export const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const authConfig = (token?: string) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
});

// Re-export hooks/utilities to keep a single import surface
export * from './useNetwork';
