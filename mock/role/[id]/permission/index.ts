export const get = (req, res) => {
  const { id } = req.query || {};

  return {
    id,
    type: "permission",
  };
};

export const post = async (req, res) => {
  return {
    body: req.body,
    type: "permission",
  };
};
