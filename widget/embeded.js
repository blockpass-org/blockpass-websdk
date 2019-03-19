/* eslint-disable */
(function() {
  window.bpWidget.VERSION = "1.0.1";

  const HTML_CONTENT = `<style>.bp-widget-container{font-family:"Helvetica Neue"}#blockpass-connect{width:auto;background-color:#000;font-size:16px;color:white;padding:10px;border-radius:10px;display:inline-block;line-height:32px;cursor:pointer;margin:40px 0}.container-form{position:relative;margin:auto;margin-top:70px;margin-bottom:70px;background-color:white;display:inline-block}.container-form-inner{position:relative;background-color:white;z-index:10;margin:auto;padding:15px}.container-qrcode{position:relative;z-index:10;background-color:white;padding:15px}.qrcode{background-color:black;text-align:center;width:290px;height:290px;margin:auto}#welcome-container{background-color:white;position:relative;z-index:10;background-color:white;padding:15px}.container-form-eth{position:relative;background-color:white;z-index:10;margin:auto;padding-top:100px;width:305px;height:305px;background-color:white}.container-eth{position:relative;z-index:10;width:590px;height:270px;background-color:white;padding-top:15px}.thanks{font-size:60px;font-weight:bold;line-height:40px;margin-bottom:30px;margin-top:35px}.thanks-message p{margin-bottom:10px;margin-left:25px}.check{margin-left:20px;width:60px;position:relative;top:-7px}.name-container{background-color:transparent;border:0;font-weight:bold;font-size:45px;text-align:center;color:black;margin-bottom:20px}.spinner{margin:10px auto 35px;width:40px;height:40px;position:relative;left:-10px}.cube1,.cube2{background-color:#000;width:15px;height:15px;position:absolute;top:0;left:0;-webkit-animation:sk-cubemove 1.8s infinite ease-in-out;animation:sk-cubemove 1.8s infinite ease-in-out}.cube2{-webkit-animation-delay:-0.9s;animation-delay:-0.9s}@-webkit-keyframes sk-cubemove{25%{-webkit-transform:translateX(42px) rotate(-90deg) scale(0.5)}50%{-webkit-transform:translateX(42px) translateY(42px) rotate(-180deg)}75%{-webkit-transform:translateX(0px) translateY(42px) rotate(-270deg) scale(0.5)}100%{-webkit-transform:rotate(-360deg)}}@keyframes sk-cubemove{25%{transform:translateX(42px) rotate(-90deg) scale(0.5);-webkit-transform:translateX(42px) rotate(-90deg) scale(0.5)}50%{transform:translateX(42px) translateY(42px) rotate(-179deg);-webkit-transform:translateX(42px) translateY(42px) rotate(-179deg)}50.1%{transform:translateX(42px) translateY(42px) rotate(-180deg);-webkit-transform:translateX(42px) translateY(42px) rotate(-180deg)}75%{transform:translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);-webkit-transform:translateX(0px) translateY(42px) rotate(-270deg) scale(0.5)}100%{transform:rotate(-360deg);-webkit-transform:rotate(-360deg)}}@media (max-width: 615px){.main-title{font-size:35px}.name-container{font-size:30px}.container-form-eth{width:200px;height:200px;padding-top:30px}.container-eth{width:auto;height:auto}.container-eth:after{content:"";display:table;clear:both}#email_address{width:100%;margin:auto;color:#000;float:none}#ethereum_submit{float:none;border:0;margin-right:0;height:40px;width:100%;margin-bottom:30px}.check{display:none}#given-eth-address{word-wrap:break-word}.thanks-message p{margin-right:25px}}</style><div class="bp-widget-container"><div style="text-align:center"><div id="blockpass-connect" onclick="onBpConnectClick()"> <img id="image_logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gESBQ4GIQPs3QAAAHFJREFUWMPtl0EKwCAMBE3tf5L/v8IPyfbSHGuhIQTpzklQcMBdVAGAVsjRiqEABU4fmNly4RgjV2C1yZscM0CBrQXEL6PMpC+rjRtVxROZc8wABVjDhiBfa+ikHcGcszYDvXe2YLNHaYRIhYV/w98LXCezDb4fzwD+AAAAAElFTkSuQmCC" style="float:left;filter: invert(100%);"> <span style="font-weight:bold">Connect</span> with <span id="service_name" style="font-weight:bold">Blockpass</span></div></div><div style="text-align:center; display:none" id="container-qrcode"><div class="container-form"><div class="container-qrcode"><div class="qrcode" id="qrcodeform"> <canvas id="qrcode" width="290" height="290"></canvas></div><p>Scan the QR code with your Blockpass mobile application</p></div></div></div><div style="text-align:center; display:none;background-color:transparent" id="welcome-container"><div class="container-form"><div class="container-form-inner"><p class="name-container" id="welcome">Thank you!</p><p>Thanks for using Blockpass, we have successfully received your info. <br/> Don't hesitate to send us your feedback at support@blockpass.org</p></p></div></div></div></div><div style="text-align:center;display:none" id="loadingComponents"><div class="container-form"><div class="container-form-eth" style="width: 320px;height:320px"><div class="spinner "><div class="cube1 "></div><div class="cube2 "></div></div><p class="display-5 ">Please confirm Identity data to upload on your mobile device</p></div></div></div></div>`;

  const loadLib = [];
  if (!window.jQuery)
    loadLib.push(
      loadScript(
        "https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"
      )
    );

  Promise.all(loadLib)
    .then(() => {
      return Promise.all([
        loadScript("https://cdn.blockpass.org/sdk/v2.0.3/blockpass.min.js"),
        loadScript(
          "https://cdn.blockpass.org/widget/scripts/websdk/jquery-qrcode-0.14.0.min.js"
        )
      ]);
    })
    .then(() => {
      main();
    })
    .catch(err => console.error(err));

  //----------------------------------------------------------------//
  //  Loading utils
  //----------------------------------------------------------------//

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.type = "text/javascript";
      if (script.readyState) {
        //IE
        script.onreadystatechange = function() {
          if (
            script.readyState === "loaded" ||
            script.readyState === "complete"
          ) {
            script.onreadystatechange = null;
            resolve();
          }
        };
      } else {
        //Others
        script.onload = function() {
          resolve();
        };
      }

      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    });
  }

  function loadStyle(url) {
    return new Promise((resolve, reject) => {
      var style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = url;
      if (style.readyState) {
        //IE
        style.onreadystatechange = function() {
          if (
            style.readyState === "loaded" ||
            style.readyState === "complete"
          ) {
            style.onreadystatechange = null;
            resolve();
          }
        };
      } else {
        //Others
        style.onload = function() {
          resolve();
        };
      }

      style.src = url;
      document.getElementsByTagName("head")[0].appendChild(style);
    });
  }

  function loadInnerHtml(div) {
    div.innerHTML = HTML_CONTENT;
  }

  //----------------------------------------------------------------//
  //  Main function
  //----------------------------------------------------------------//

  function renderQRCode(params) {
    const clientId = sdk.clientId;
    const env = sdk.env;
    const refId = window.bpWidget.refId;

    let data = JSON.stringify({ clientId, session: params.session, refId });

    if (env === "staging" || env === "local") {
      console.log(`3rd-sso ${clientId} ${params.session} ${refId}`);
    }

    const options = {
      render: "canvas",
      minVersion: 1,
      maxVersion: 40,
      ecLevel: "L",
      left: 0,
      top: 0,
      size: 290,
      fill: "#000000",
      background: "#ffffff",
      text: data
        ? data
        : "Hello something went wrong when we try to generate session please reload the webpage",
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

    jQuery("#qrcode").qrcode(options);
  }

  let sdk;
  let div;
  let appLinkUrl;
  function main() {
    console.log("start", window.bpWidget);
    sdk = new window.Blockpass.WebSDK({
      clientId: window.bpWidget.clientId,
      env: window.bpWidget.env
    });

    div = document.getElementById("widget-bp123");

    sdk.on("code-refresh", onBlockpassCodeRefresh);
    sdk.on("sso-processing", onBlockpassProcessing);
    sdk.on("sso-complete", onBlockpassSSoResult);

    // Create new code when session expired
    sdk.on("code-expired", _ => {
      startNewSession();
    });

    startNewSession();
  }

  function startNewSession() {
    loadInnerHtml(div);
    // app-link
    sdk.getApplink().then(url => {
      appLinkUrl = url;
      window.bpWidget.appLinkUrl = url;
    });
    // apply service specific
    $("#service_name").text(window.bpWidget.serviceName);
    // refresh new sso code
    sdk.generateSSOData();
  }

  function onBlockpassCodeRefresh(params) {
    console.log(params);

    // On Click events
    window.onBpConnectClick = function(ev) {
      $("#blockpass-connect").hide();
      $("#container-qrcode").fadeIn(500);
      $("#instructions").fadeIn(1000);

      renderQRCode(params);
    };
  }

  function onBlockpassProcessing() {
    $("#container-qrcode").fadeOut(200, function() {
      $("#loadingComponents").fadeIn(100, function() {});
    });
  }

  function onBlockpassSSoResult(params) {
    // Notify BPWidget done
    if (window.bpWidget.onSSOComplete)
      window.bpWidget.onSSOComplete(params, startNewSession);
    $("#container-qrcode").fadeOut();
    $("#loadingComponents").fadeOut(500, function() {
      $("#welcome-container").fadeIn(1000);
    });
  }
})();
