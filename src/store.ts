import { MockMethod } from "./useMock";

interface MockConfig {
  default: MockMethod;
  get: MockMethod;
  post: MockMethod;
  del: MockMethod;
  patch: MockMethod;
  [index: string]: MockMethod;
}

export type MockData = { router: string[]; config: Partial<MockConfig> };

export let store = {
  mockData: [] as MockData[],
  routers: [] as string[][],
};
