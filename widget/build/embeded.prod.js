!(function() {
  window.bpWidget.VERSION = "1.0.1";
  const e =
      '<style>.bp-widget-container{font-family: "Helvetica Neue"}#blockpass-connect{width: auto; background-color: #000; font-size: 16px; color: white; padding: 10px; border-radius: 10px; display: inline-block; line-height: 32px; cursor: pointer; margin: 40px 0;}.container-form{position: relative; margin: auto; margin-top: 70px; margin-bottom: 70px; background-color: white; display: inline-block;}.container-form-inner{position: relative; background-color: white; z-index: 10; margin: auto; padding: 15px;}.container-qrcode{position: relative; z-index: 10; background-color: white; padding: 15px;}.qrcode{background-color: black; text-align: center; width: 290px; height: 290px; margin: auto;}#welcome-container{background-color: white; position: relative; z-index: 10; background-color: white; padding: 15px;}.container-form-eth{position: relative; background-color: white; z-index: 10; margin: auto; padding-top: 100px; width: 305px; height: 305px; background-color: white;}.container-eth{position: relative; z-index: 10; width: 590px; height: 270px; background-color: white; padding-top: 15px;}.thanks{font-size: 60px; font-weight: bold; line-height: 40px; margin-bottom: 30px; margin-top: 35px;}.thanks-message p{margin-bottom: 10px; margin-left: 25px;}.check{margin-left: 20px; width: 60px; position: relative; top: -7px;}.name-container{background-color: transparent; border: 0; font-weight: bold; font-size: 45px; text-align: center; color: black; margin-bottom: 20px;}/*loading anim */ .spinner{margin: 10px auto 35px; width: 40px; height: 40px; position: relative; left: -10px;}.cube1, .cube2{background-color: #000; width: 15px; height: 15px; position: absolute; top: 0; left: 0; -webkit-animation: sk-cubemove 1.8s infinite ease-in-out; animation: sk-cubemove 1.8s infinite ease-in-out;}.cube2{-webkit-animation-delay: -0.9s; animation-delay: -0.9s;}@-webkit-keyframes sk-cubemove{25%{-webkit-transform: translateX(42px) rotate(-90deg) scale(0.5)}50%{-webkit-transform: translateX(42px) translateY(42px) rotate(-180deg)}75%{-webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5)}100%{-webkit-transform: rotate(-360deg)}}@keyframes sk-cubemove{25%{transform: translateX(42px) rotate(-90deg) scale(0.5); -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);}50%{transform: translateX(42px) translateY(42px) rotate(-179deg); -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);}50.1%{transform: translateX(42px) translateY(42px) rotate(-180deg); -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);}75%{transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5); -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);}100%{transform: rotate(-360deg); -webkit-transform: rotate(-360deg);}}/* Responsive */ @media (max-width: 615px){.main-title{font-size: 35px;}.name-container{font-size: 30px;}.container-form-eth{width: 200px; height: 200px; padding-top: 30px;}.container-eth{width: auto; height: auto;}.container-eth:after{content: ""; display: table; clear: both;}#email_address{width: 100%; margin: auto; color: #000; float: none;}#ethereum_submit{float: none; border: 0; margin-right: 0; height: 40px; width: 100%; margin-bottom: 30px;}.check{display: none;}#given-eth-address{word-wrap: break-word;}.thanks-message p{margin-right: 25px;}}</style><div class="bp-widget-container"> <div style="text-align:center"> <div id="blockpass-connect" onclick="onBpConnectClick()"> <img id="image_logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gESBQ4GIQPs3QAAAHFJREFUWMPtl0EKwCAMBE3tf5L/v8IPyfbSHGuhIQTpzklQcMBdVAGAVsjRiqEABU4fmNly4RgjV2C1yZscM0CBrQXEL6PMpC+rjRtVxROZc8wABVjDhiBfa+ikHcGcszYDvXe2YLNHaYRIhYV/w98LXCezDb4fzwD+AAAAAElFTkSuQmCC" style="float:left;filter: invert(100%);"> <span style="font-weight:bold">Connect</span> with <span id="service_name" style="font-weight:bold">Blockpass</span> </div></div><div style="text-align:center; display:none" id="container-qrcode"> <div class="container-form"> <div class="container-qrcode"> <div class="qrcode" id="qrcodeform"> <canvas id="qrcode" width="290" height="290"></canvas> </div><p>Scan the QR code with your Blockpass mobile application</p></div></div></div><div style="text-align:center; display:none;background-color:transparent" id="welcome-container"> <div class="container-form"> <div class="container-form-inner"> <p class="name-container" id="welcome">Thank you!</p><p>Thanks for using Blockpass, we have successfully received your info. <br/> Don\'t hesitate to send us your feedback at support@blockpass.org </p></p></div></div></div></div><div style="text-align:center;display:none" id="loadingComponents"> <div class="container-form"> <div class="container-form-eth" style="width: 320px;height:320px"> <div class="spinner "> <div class="cube1 "></div><div class="cube2 "></div></div><p class="display-5 ">Please wait</p></div></div></div></div>',
    t = [];
  function n(e) {
    return new Promise((t, n) => {
      const o = document.createElement("script");
      (o.type = "text/javascript"),
        o.readyState
          ? (o.onreadystatechange = function() {
              (o.readyState !== "loaded" && o.readyState !== "complete") ||
                ((o.onreadystatechange = null), t());
            })
          : (o.onload = function() {
              t();
            }),
        (o.src = e),
        document.getElementsByTagName("head")[0].appendChild(o);
    });
  }
  let o, i, a;
  function r() {
    !(function(t) {
      t.innerHTML = e;
    })(i),
      (a = o.getApplink()),
      $("#service_name").text(window.bpWidget.serviceName),
      o.generateSSOData();
  }
  function s(e) {
    window.onBpConnectClick = function(t) {
      $("#blockpass-connect").hide(),
        $("#container-qrcode").fadeIn(500),
        $("#instructions").fadeIn(1e3),
        (function(e) {
          const t = o.clientId,
            n = (o.env, window.bpWidget.refId);
          const i = JSON.stringify({
            clientId: t,
            session: e.session,
            refId: n
          });
          const a = {
            render: "canvas",
            minVersion: 1,
            maxVersion: 40,
            ecLevel: "L",
            left: 0,
            top: 0,
            size: 290,
            fill: "#000000",
            background: "#ffffff",
            text:
              i ||
              "Hello something went wrong when we try to generate session please reload the webpage",
            radius: 0.5,
            quiet: 1,
            mode: 4,
            mSize: 0.1,
            mPosX: 0.5,
            mPosY: 0.5,
            label: "no label",
            fontname: "sans",
            fontcolor: "#000",
            image: document.getElementById("image_logo")
          };
          jQuery("#qrcode").qrcode(a);
        })(e);
    };
  }
  function d() {
    $("#container-qrcode").fadeOut(200, () => {
      $("#loadingComponents").fadeIn(100, () => {});
    });
  }
  function c(e) {
    window.bpWidget.onSSOComplete && window.bpWidget.onSSOComplete(e, r),
      $("#container-qrcode").fadeOut(),
      $("#loadingComponents").fadeOut(500, () => {
        $("#welcome-container").fadeIn(1e3);
      });
  }
  window.jQuery ||
    t.push(
      n("https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js")
    ),
    Promise.all(t)
      .then(() =>
        Promise.all([
          n("https://cdn.blockpass.org/sdk/v2.0.1/blockpass.min.js"),
          n(
            "https://cdn.blockpass.org/widget/scripts/websdk/jquery-qrcode-0.14.0.min.js"
          )
        ])
      )
      .then(() => {
        (o = new window.Blockpass.WebSDK({
          clientId: window.bpWidget.clientId,
          env: window.bpWidget.env
        })),
          (i = document.getElementById("widget-bp123")),
          o.on("code-refresh", s),
          o.on("sso-processing", d),
          o.on("sso-complete", c),
          o.on("code-expired", e => {
            r();
          }),
          r();
      })
      .catch(e => void 0);
})();
