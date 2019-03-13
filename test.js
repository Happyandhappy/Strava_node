var strava = require("strava-v3");
var fs = require("fs");

// strava.oauth.getRequestAccessURL({scope:"view_private,write"})
/*
strava.athlete.get({}, function(err, payload, limits) {
  console.log("1 ----->> athlete get");
  fs.writeFileSync("1_athlete_get.txt", JSON.stringify(payload, "", 3));
  if (err) console.log(err);
  console.log("1 <<----- athlete get");
});

strava.athlete.listFollowers({}, function(err, payload, limits) {
  console.log("2 ----->> list followers");
  fs.writeFileSync("2_list followers.txt", JSON.stringify(payload, "", 3));
  if (err) console.log(err);
  console.log("2 <<----- list followers");
});

strava.athletes.get({ id: "16560" }, function(err, payload, limits) {
  console.log("3 ----->> athletes get");
  fs.writeFileSync("3_athletes_get.txt", JSON.stringify(payload, "", 3));
  if (err) console.log(err);
  console.log("3 <<----- athletes get");
});

strava.athlete.listRoutes({}, function(err, payload, limits) {
  console.log("4 ----->> list routes");
  if (err) console.log(err);
  fs.writeFileSync("4_list_routes.txt", JSON.stringify(payload, "", 3));
  console.log("4 <<----- list routes");
});

strava.routes.get({ id: "7273279" }, function(err, payload, limits) {
  console.log("5 ----->> routes get");
  fs.writeFileSync("5_routes_get.txt", JSON.stringify(payload, "", 3));
  if (err) console.log(err);
  console.log("5 <<----- routes get");
});

strava.athlete.listZones({ zones: "power" }, function(err, payload, limits) {
  console.log("6 ----->> list zones");
  console.log(payload);
  console.log(err);
  console.log("6 <<----- list zones");
});

strava.routes.getAsGPX({ id: "7273279" }, function(err, payload, limits) {
  console.log("7 ----->> routes get as gpx");
  fs.writeFileSync("7_routes_get_as_gpx.txt", payload);
  if (err) console.log(err);
  console.log("7 <<----- routes get as gpx");
});
1153246449
 1153228025
 1153294755

id = "1153228025";
strava.streams.activity(
  {
    id: id,
    types: "heartrate,distance,latlng,time,altitude,watts,temp,velocity_smooth"
  },
  function(err, payload, limits) {
    if (err) console.log(err);
    if (payload.message) {
      console.log(payload);
    } else {
      fs.writeFileSync("8_streams_segment.txt", JSON.stringify(payload, "", 3));
    }
    // expertCSV(payload, id);
  }
);
*/
// initialize variables
var ActivityIDs = [];
var number = 0;
var allActivities = [];

// create new folder from Date to store csv files
var folderName = `csvs/${new Date().toISOString().split("T")[0]}`;
if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

function getValue(payload, name, num) {
  for (var i = 0; i < payload.length; i++) {
    if (payload[i].type === name) {
      return payload[i].data[num];
    }
  }
  return "";
}

function expertCSV(payload, id) {
  var content =
    "Distance ,Altitude, Time, Lat, Lng , Heartrate, Speed, Power, Temperature , start_date, moving_time, elapsed_time, total_elevation_gain, type, id, timezone,athlete_count\n";
  for (var i = 0; i < payload[0].data.length; i++) {
    content +=
      getValue(payload, "distance", i) +
      //   payload[2].data[i] +
      "," +
      getValue(payload, "altitude", i) +
      //   payload[3].data[i] +
      "," +
      getValue(payload, "time", i) +
      //   payload[1].data[i] +
      "," +
      getValue(payload, "latlng", i)[0] +
      //   payload[0].data[i][0] +
      "," +
      getValue(payload, "latlng", i)[1] +
      //   payload[0].data[i][1] +
      "," +
      getValue(payload, "heartrate", i) +
      //   payload[4].data[i] +
      "," +
      getValue(payload, "velocity_smooth", i) +
      //   payload[7].data[i] +
      "," +
      getValue(payload, "watts", i) +
      //   payload[5].data[i] +
      "," +
      getValue(payload, "temp", i) +
      //   payload[6].data[i] +
      "," +
      allActivities[id].start_date +
      "," +
      allActivities[id].moving_time +
      "," +
      allActivities[id].elapsed_time +
      "," +
      allActivities[id].total_elevation_gain +
      "," +
      allActivities[id].type +
      "," +
      allActivities[id].id +
      "," +
      allActivities[id].timezone +
      "," +
      allActivities[id].athlete_count +
      "\n";
  }
  fs.writeFileSync(`${folderName}/${allActivities[id].id}.csv`, content);
}

function getStreamActivities() {
  id = number;
  strava.streams.activity(
    {
      id: ActivityIDs[id],
      types:
        "heartrate,distance,latlng,time,altitude,watts,temp,velocity_smooth"
    },
    function(err, payload, limits) {
      console.log(` ${id}----->> streams segment ${ActivityIDs[id]}`);
      if (err) {
        console.log(err);
      } else {
        if (payload.message) {
        } else {
          fs.writeFileSync(
            "8_streams_segment.txt",
            JSON.stringify(payload, "", 3)
          );
          /*  
              if (number === 0)
                fs.writeFileSync( "8_streams_segment.txt", JSON.stringify(payload, "", 3));
              else
                fs.appendFileSync( "8_streams_segment.txt", JSON.stringify(payload, "", 3));
              */
          expertCSV(payload, id);
        }
      }
      number++;
      if (number < ActivityIDs.length) getStreamActivities();
    }
  );
}

function getAcitivies(page) {
  strava.athlete.listActivities({ per_page: 200, page: page }, function(
    err,
    payload,
    limits
  ) {
    console.log("----->> Start list activities");
    if (err || payload.length === 0) {
      if (err) console.log(err);
      fs.writeFileSync(
        "9_list_activities.txt",
        JSON.stringify(allActivities, "", 3)
      );

      fs.writeFileSync(
        "9_list_activities_IDs.txt",
        JSON.stringify(ActivityIDs, "", 3)
      );
      console.log(" <<----- End list activities");
      getStreamActivities();
      number++;
      getStreamActivities();
      number++;
      getStreamActivities();
      number++;
      getStreamActivities();
      number++;
      getStreamActivities();
    } else {
      // print number of list in current page
      console.log(`page ${page}' has ${payload.length} records`);

      // filter "type": "Ride"
      for (var i = 0; i < payload.length; i++) {
        if (payload[i].type === "Ride") {
          allActivities.push(payload[i]);
          ActivityIDs.push(payload[i].id);
        }
      }
      getAcitivies(page + 1);
    }
  });
}
getAcitivies(0);
