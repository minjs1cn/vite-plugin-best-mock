import { MockData } from "./store";

export function getMockByUrl(url: string, mockData: MockData[]) {
  const pp = url.split("/").filter(Boolean);

  return mockData.find(({ router }) => {
    for (let index = 0; index < pp.length; index++) {
      const p = pp[index];
      if (p !== router[index] || !/^\[(.+)\]$/.test(router[index])) {
        return false;
      }
    }
    return true;
  });
}
