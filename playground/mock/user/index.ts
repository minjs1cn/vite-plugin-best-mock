export const get = (req) => {
  const { id } = req.query || {};
  return {
    id,
    name: "清扬",
  };
};

export const post = (req) => {
  const { id } = req.body || {};
  return {
    id,
    name: "清扬",
  };
};
