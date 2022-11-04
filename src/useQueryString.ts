import qs from "qs";
import { Connect } from "vite";

export function useQueryString(): Connect.NextHandleFunction {
  return (req, _, next) => {
    const { originalUrl = "" } = req;
    const [, search] = originalUrl.split("?");
    const query = qs.parse(search);
    // @ts-ignore
    req.query = query;
    next();
  };
}
