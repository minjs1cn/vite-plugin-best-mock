import { MockMethod } from 'core';

export const get: MockMethod = (req) => {
  const { id } = req.query || {};
  return {
    id,
    name: '清扬',
  };
};

export const post: MockMethod = (req) => {
  const { id } = req.body || {};
  return {
    id,
    name: '清扬',
  };
};
