const axios: any = jest.genMockFromModule("axios");
axios.create = jest.fn().mockImplementationOnce(() => axios);
export default axios;
