import { MockData } from "./store";

export function getMockByUrl(url: string, mockData: MockData[]) {
  const pp = url.split("/").filter(Boolean);
  return mockData
    .filter(
      ({ router }) =>
        router.length - pp.length >= 0 && router.length - pp.length <= 1
    )
    .find(
      ({ router }) =>
        pp.filter(
          (p, index) => p === router[index] || router[index].endsWith("]")
        ).length === pp.length
    );
}
