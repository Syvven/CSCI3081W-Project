// Web Sockets API for communication with the backend
let api = new WSApi();

const scale = 0.705;
const min = {
   x: -2030.950927734375,
   y: 220.99996948242188,
   z: -1184.1085205078125
};
const max = {
   x: 2249.523193359375,
   y: 286.9197998046875,
   z: 1261.8768310546875
};
let trip = [];

// This method is called when the document is loaded
$(document).ready(function() {
   // hide the popup
   $("#shield").hide();
   $("#popup").hide();

   // register a mouse click event that adds circles on an image
   $('#map').click(function(e) {
      var posX = e.pageX - $(this).offset().left;
      var posY = e.pageY - $(this).offset().top;
      $("#map").append(
         '<circle cx="' + posX +
         '" cy="' + posY +
         '" r="10" stroke="green" stroke-width="4" fill="yellow" />');
      $("#map").html($("#map").html());
      trip.push([posX, posY]);
   });
});

function mapToSim(coords) {
   return [
      (min.x + (max.x - min.x) * (coords[0] / ($("#map").width()))) * scale,
      254.665,
      (min.z + (max.z - min.z) * (coords[1] / ($("#map").height()))) * scale
   ];
}

function compareCoords(a, b) {
   console.log(a, b);
   return Math.abs(a[0] - b[0]) < 0.01
      && Math.abs(a[1] - b[1]) < 0.01
      && Math.abs(a[2] - b[2]) < 0.01;
}

// Web sockets event callback
api.onmessage = function(msg, data) {
   // handles events
   if ("event" in data) {
      if (
         trip != []
         && data.event == "AddEntity"
         && data.details.details.name == $("#name").val()
         && data.details.details.type == "robot"
         && compareCoords(data.details.details.position, mapToSim(trip[0]))
      ) {
         sendTrip(data.details);
      } else if (data.event == "TripScheduled") {
         let details = $("#name").val() + ": ";
         for (let i = 0; i < trip.length; i++) {
            if (i != 0) {
               details += " ---> ";
            }
            details += "(" + trip[i][0].toFixed(1) + ", " + trip[i][1].toFixed(1) + ")";
         }
         trip = [];
         $("#list").append("<div class='trip'>" + details + "</div>");
         $("#name").prop("value", "");
         $("#name").prop("disabled", false);
         $("#search-strategy").prop("disabled", false);
         $("#map").html("");
         $("#schedule").prop("Value", "Schedule Trip");
         $("#schedule").prop("disabled", false);
         document.getElementById("msg").textContent = "Your trip is scheduled!";
         $("#popup").fadeOut(5000);
         $("#shield").fadeOut(5000);
      }
   }
}

// This function schedules a trip and sends the command to the web sockets api.
function schedule() {
   let errorDiv = document.getElementById("nameError");
   errorDiv.innerHTML = "";
   let name = $("#name").val();
   if (name == "") {
      errorDiv.innerHTML += '<p style="color: red">[!] Error, missing name...</p>'
   } else if (trip.length < 2) {
      errorDiv.innerHTML += '<p style="color: red">[!] Error, missing pickup and drop off location ...</p>'
   } else {
      $("#name").prop("disabled", true);
      $("#search-strategy").prop("disabled", true);
      $("#shield").show();
      document.getElementById("msg").textContent = "Scheduling trip...";
      $("#popup").show();
      $("#schedule").prop("disabled", true);
      $("#schedule").prop("Value", "Scheduling, please wait...");

      // Creates robot with info here
      $.getJSON("assets/model/robot.json", (data) => {
         data["name"] = name;
         data["position"] = mapToSim(trip[0]);
         api.sendCommand("CreateEntity", data);
      });
   }
}

function sendTrip(data) {
   console.log(data);
   let searchStrat = $("#search-strategy").val();
   let end = [
      trip[trip.length - 1][0] / ($("#map").width()),
      1.0,
      trip[trip.length - 1][1] / ($("#map").height())
   ];
   api.sendCommand(
      "ScheduleTrip",
      {
         name: data.details.id,
         start: [trip[0][0], trip[0][1]],
         end: [
            (min.x + (max.x - min.x) * end[0]) * scale,
            254.665 * end[1],
            (min.z + (max.z - min.z) * end[2]) * scale
         ],
         search: searchStrat
      }
   );
}
