export const post = (req, res) => {
  const { id } = req.body || {};
  const { file } = req.files || {};
  res.end(
    JSON.stringify({
      id,
      ...file,
    })
  );
};
post.timeout = [3000, 5000];
