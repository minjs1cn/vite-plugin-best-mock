import { MockMethod } from "vite-plugin-best-mock";

export const post: MockMethod = (req, res) => {
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
