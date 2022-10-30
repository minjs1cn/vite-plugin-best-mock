import { MockMethod } from 'core';

export const get: MockMethod = (req, res) => {
  const { id } = req.query || {};
  res.end(
    JSON.stringify({
      id,
      name: 'qingyang11',
    }),
  );
};

export const post: MockMethod = (req) => {
  const { id } = req.query || {};
  return {
    id,
    name: 'qingyang',
  };
};
