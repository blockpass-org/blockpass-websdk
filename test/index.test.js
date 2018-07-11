import nodeFetch from "node-fetch";
import { WebSDK } from "../src";
import nork from "nock";

global.fetch = nodeFetch;

const BASE_URL = "http://unit-test";
const CLIENT_ID = "testClientId";

describe("basic-features", () => {
  it("generate-sessioncode", done => {
    const FAKE_SESSION_ID = "0123";

    const webSdk = new WebSDK({
      baseUrl: BASE_URL,
      clientId: CLIENT_ID
    });

    const mockRequest = nork(BASE_URL)
      .post(`/api/v0.3/service/register/${CLIENT_ID}`, body => true)
      .reply(200, { session: FAKE_SESSION_ID });

    webSdk.on("code-refresh", codeResponse => {
      expect(codeResponse.session).toBe(FAKE_SESSION_ID);
      webSdk.destroy();
      done();
    });

    webSdk.generateSSOData();
  });

  it("generate-monitor-sessioncode", done => {
    const FAKE_SESSION_ID = "0123";

    const webSdk = new WebSDK({
      baseUrl: BASE_URL,
      clientId: CLIENT_ID,
      refreshRateMs: 10
    });

    // mock code generate
    const mockRequest = nork(BASE_URL)
      .post(`/api/v0.3/service/register/${CLIENT_ID}`, body => true)
      .reply(200, { session: FAKE_SESSION_ID });

    // 1st time => processing
    let refreshRequest = nork(BASE_URL)
      .get(`/api/v0.3/service/registerPolling/${FAKE_SESSION_ID}`)
      .once()
      .reply(200, { status: "success", data: { status: "processing" } });

    // callback code-refresh
    webSdk.on("code-refresh", codeResponse => {
      expect(codeResponse.session).toBe(FAKE_SESSION_ID);
    });

    // callback code-processing ( 1 time )
    webSdk.once("sso-processing", response => {
      expect(response.status).toBe("processing");

      // 2nd time => complete
      refreshRequest = nork(BASE_URL)
        .get(`/api/v0.3/service/registerPolling/${FAKE_SESSION_ID}`)
        .once()
        .reply(200, {
          status: "success",
          data: {
            status: "success",
            extraData: {
              sessionData: FAKE_SESSION_ID,
              extraData: {
                myNameIs: "bot"
              }
            }
          }
        });
    });

    // calback sso-complete
    webSdk.on("sso-complete", response => {
      expect(response.extraData.extraData.myNameIs).toBe("bot");
      webSdk.destroy();
      done();
    });

    webSdk.generateSSOData();
  });

  it("generate-monitor-sessioncode-error", done => {
    const FAKE_SESSION_ID = "0123";

    const webSdk = new WebSDK({
      baseUrl: BASE_URL,
      clientId: CLIENT_ID,
      refreshRateMs: 10
    });

    // mock code generate
    const mockRequest = nork(BASE_URL)
      .post(`/api/v0.3/service/register/${CLIENT_ID}`, body => true)
      .reply(200, { session: FAKE_SESSION_ID });

    // 1st time => processing
    let refreshRequest = nork(BASE_URL)
      .get(`/api/v0.3/service/registerPolling/${FAKE_SESSION_ID}`)
      .once()
      .reply(200, { status: "success", data: { status: "processing" } });

    // callback code-refresh
    webSdk.on("code-refresh", codeResponse => {
      expect(codeResponse.session).toBe(FAKE_SESSION_ID);
    });

    // callback code-processing ( 1 time )
    webSdk.once("sso-processing", response => {
      expect(response.status).toBe("processing");

      // 2nd time => complete
      refreshRequest = nork(BASE_URL)
        .get(`/api/v0.3/service/registerPolling/${FAKE_SESSION_ID}`)
        .once()
        .reply(200, {
          status: "success",
          data: {
            status: "failed",
            extraData: {
              sessionData: FAKE_SESSION_ID,
              extraData: {
                err: 403,
                msg: "missing required permission"
              }
            }
          }
        });
    });

    // calback sso-complete
    webSdk.on("sso-complete", response => {
      expect(response.status).toBe("failed");
      expect(response.extraData.extraData.err).toBe(403);
      webSdk.destroy();
      done();
    });

    webSdk.generateSSOData();
  });

  it("generate(x2)-monitor-sessioncode", done => {
    const FAKE_SESSION_ID = "0123";
    const FAKE_SESSION_ID_NEW = "new-id";

    const webSdk = new WebSDK({
      baseUrl: BASE_URL,
      clientId: CLIENT_ID,
      refreshRateMs: 10
    });

    const codeResponseSequence = [FAKE_SESSION_ID, FAKE_SESSION_ID_NEW];
    let codeResponseCount = 0;

    // mock code generate
    const mockRequest = nork(BASE_URL)
      .post(`/api/v0.3/service/register/${CLIENT_ID}`, body => true)
      .twice()
      .reply(200, _ => ({
        session: codeResponseSequence[codeResponseCount++]
      }));

    // 1st time => processing
    let refreshRequest = nork(BASE_URL)
      .get(`/api/v0.3/service/registerPolling/${FAKE_SESSION_ID_NEW}`)
      .once()
      .reply(200, { status: "success", data: { status: "processing" } });

    // callback code-refresh
    let count = 0;
    webSdk.on("code-refresh", codeResponse => {
      const shouldBe = count === 0 ? FAKE_SESSION_ID : FAKE_SESSION_ID_NEW;
      count++;
      expect(codeResponse.session).toBe(shouldBe);
    });

    // callback code-processing ( 1 time )
    webSdk.once("sso-processing", response => {
      expect(response.status).toBe("processing");

      // 2nd time => complete
      refreshRequest = nork(BASE_URL)
        .get(`/api/v0.3/service/registerPolling/${FAKE_SESSION_ID_NEW}`)
        .once()
        .reply(200, {
          status: "success",
          data: {
            status: "success",
            extraData: {
              sessionData: FAKE_SESSION_ID_NEW,
              extraData: {
                myNameIs: "bot"
              }
            }
          }
        });
    });

    // calback sso-complete
    webSdk.on("sso-complete", response => {
      expect(response.extraData.sessionData).toBe(FAKE_SESSION_ID_NEW);
      webSdk.destroy();
      done();
    });

    // 1s time call
    webSdk.generateSSOData();

    // 2nd time call => 1st code should be override
    setTimeout(_ => {
      webSdk.generateSSOData();
    }, 1);
  });

  it("applink-generate", done => {
    const FAKE_SESSION_ID = "0123";

    const webSdk = new WebSDK({
      baseUrl: BASE_URL,
      clientId: CLIENT_ID,
      env: "local"
    });

    const mockRequest = nork(BASE_URL)
      .post(`/api/v0.3/service/register/${CLIENT_ID}`, body => true)
      .reply(200, { session: FAKE_SESSION_ID });

    webSdk.generateSSOData();

    webSdk.getApplink().then(res => {
      expect(res).toBe("blockpass-local://sso/testClientId/0123");
      webSdk.getApplink().then(res => {
        expect(res).toBe("blockpass-local://sso/testClientId/0123");
        done();
      });
    });
  });
});
