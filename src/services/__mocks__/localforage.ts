const localforage: any = jest.genMockFromModule("localforage");
localforage.createInstance = jest
  .fn()
  .mockImplementationOnce(() => localforage);
export default localforage;
