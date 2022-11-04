export const get = (req, res) => {
  const { id } = req.query || {};
  return {
    id,
    name: "qingyang123",
  };
};

export const post = (req) => {
  const { id } = req.query || {};
  return {
    id,
    name: "qingyang",
  };
};
