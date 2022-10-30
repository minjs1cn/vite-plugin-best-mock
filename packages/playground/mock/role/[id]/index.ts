import { MockMethod } from 'core';

export const get: MockMethod = (req, res) => {
  const { id } = req.query || {};

  return {
    id,
    type: 'permission',
  };
};

export const post: MockMethod = async (req: any, res: any) => {
  const { id } = req.body || {};

  return {
    id,
    type: 'permission',
  };
};
