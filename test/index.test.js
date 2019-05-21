import nodeFetch from "node-fetch";
import nork from "nock";
import { WebSDK } from "../src";

global.fetch = nodeFetch;

const BASE_URL = "http://unit-test";
const CLIENT_ID = "testClientId";

const BLOCKPASS_API = {
  generateSessionCode: "/api/3rdService/register/session",
  getSessionStatus: "/api/3rdService/register/status"
};

describe("basic-features", () => {
  it("construct-sdk-error", done => {
    try {
      const webSdk = new WebSDK({});
    } catch (error) {
      expect(error.message).toBe(
        "Missing critical config paramaters: clientId"
      );
      done();
    }
  });
  it("generate-sessioncode", done => {
    const FAKE_SESSION_ID = "0123";

    const webSdk = new WebSDK({
      baseUrl: BASE_URL,
      clientId: CLIENT_ID
    });

    // mock code generate
    nork(BASE_URL)
      .get(`${BLOCKPASS_API.generateSessionCode}/${CLIENT_ID}`)
      .reply(200, { status: "success", data: { session: FAKE_SESSION_ID } });

    // mock session status to for websdk graceful shutdown
    nork(BASE_URL)
      .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID}`)
      .reply(200, { status: "success", data: { status: "processing" } });

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
    nork(BASE_URL)
      .get(`${BLOCKPASS_API.generateSessionCode}/${CLIENT_ID}`)
      .reply(200, { status: "success", data: { session: FAKE_SESSION_ID } });

    // 1st time => processing
    nork(BASE_URL)
      .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID}`)
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
      nork(BASE_URL)
        .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID}`)
        .once()
        .reply(200, {
          status: "success",
          data: {
            status: "success",
            customData: {
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
      expect(response.customData.extraData.myNameIs).toBe("bot");
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
    nork(BASE_URL)
      .get(`${BLOCKPASS_API.generateSessionCode}/${CLIENT_ID}`)
      .reply(200, { status: "success", data: { session: FAKE_SESSION_ID } });

    // 1st time => processing
    nork(BASE_URL)
      .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID}`)
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
      nork(BASE_URL)
        .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID}`)
        .once()
        .reply(200, {
          status: "success",
          data: {
            status: "failed",
            customData: {
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
      expect(response.customData.extraData.err).toBe(403);
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
    nork(BASE_URL)
      .get(`${BLOCKPASS_API.generateSessionCode}/${CLIENT_ID}`)
      .twice()
      .reply(200, _ => ({
        status: "success",
        data: {
          session: codeResponseSequence[codeResponseCount++]
        }
      }));

    // 1st time => processing
    nork(BASE_URL)
      .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID}`)
      .reply(200, { status: "success", data: { status: "processing" } });

    // callback code-refresh
    let count = 0;
    webSdk.on("code-refresh", codeResponse => {
      const shouldBe = count === 0 ? FAKE_SESSION_ID : FAKE_SESSION_ID_NEW;
      expect(codeResponse.session).toBe(shouldBe);
      if (count === 1) {
        nork(BASE_URL)
          .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID_NEW}`)
          .once()
          .reply(200, {
            status: "success",
            data: {
              status: "processing"
            }
          });
      }
      count += 1;
    });

    // callback code-processing ( 1 time )
    webSdk.once("sso-processing", response => {
      expect(response.status).toBe("processing");

      nork(BASE_URL)
        .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID_NEW}`)
        .once()
        .reply(200, {
          status: "success",
          data: {
            status: "success",
            customData: {
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
      expect(response.customData.sessionData).toBe(FAKE_SESSION_ID_NEW);
      webSdk.destroy();
      done();
    });

    // 1s time call
    webSdk.generateSSOData();

    // 2nd time call => 1st code should be override
    setTimeout(() => {
      webSdk.generateSSOData();
    }, 100);
  });

  it("applink-generate", done => {
    const FAKE_SESSION_ID = "0123";

    const webSdk = new WebSDK({
      baseUrl: BASE_URL,
      clientId: CLIENT_ID,
      env: "local"
    });

    nork(BASE_URL)
      .get(`${BLOCKPASS_API.generateSessionCode}/${CLIENT_ID}`)
      .reply(200, { status: "sucess", data: { session: FAKE_SESSION_ID } });

    nork(BASE_URL)
      .get(`${BLOCKPASS_API.getSessionStatus}/${FAKE_SESSION_ID}`)
      .once()
      .reply(200, { status: "success", data: { status: "processing" } });

    webSdk.generateSSOData();

    webSdk.getApplink().then(res => {
      expect(res).toBe(
        "blockpass-local://service-register/testClientId?session=0123"
      );
      webSdk.getApplink().then(res2 => {
        expect(res2).toBe(
          "blockpass-local://service-register/testClientId?session=0123"
        );
        done();
      });
    });
  });
});
