var request = require("request");
var fs = require("fs");

function run() {
  request.post(
    "https://www.strava.com/oauth/token",
    {
      json: {
        client_id: "16560",
        client_secret: "952ad2776cfeee810e58edc79b110713605b4e73",
        code: "d5aca2620b502943b8a8ef966791140d940da9ac",
        grant_type: "authorization_code",
        scope: "activity:read_all"
      }
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        fs.writeFileSync("strava-code-out.txt", JSON.stringify(body, "", 3));
        access_token = body.access_token;
        fs.writeFileSync(
          "data/strava_config",
          `{\n"access_token"    :"${access_token}", \n"client_id"  :  "16560", \n"client_secret" :"952ad2776cfeee810e58edc79b110713605b4e73", \n"redirect_uri"  :"http://localhost"\n}`
        );
        console.log(
          "result saved in strava-code-out.txt and data/strava_config was updated new access_token"
        );
      }
    }
  );
}

run();
