// Web Sockets API for communication with the backend
let api = new WSApi();

// global variables
let entities = {};
let new_dispatch_list = [];
const min = {
    x: -1450,
    y: 0,
    z: -850
};
const max = {
    x: 1575,
    y: 0,
    z: 875
};

// This method is called when the document is loaded
$(document).ready(function () {
    // hide the popup
    $("#popup").hide();
    $("#pin").hide();

    // register a mouse click event that adds circles on an image
    $('#pin-overlay').click(function (e) {
        var posX = e.pageX - $(this).offset().left;
        var posY = e.pageY - $(this).offset().top;
        $("#pin-overlay").append('<circle class="new" cx="' + posX + '" cy="' + posY + '" r="10" stroke="white" stroke-width="4" fill="red" />');
        $("#pin-overlay").html($("#pin-overlay").html());
        new_dispatch_list.push([posX, posY]);
    });
});

// Web sockets event callback
try {
    // Handle events, listen for when the system wants to create new scene objects.
    api.onmessage = function (msg, data) {
        if ("event" in data) {
            if (data.event == "AddEntity") {
                addEntity(data.details);
            } else if (data.event == "UpdateEntity") {
                let id = data.details.details.id;
                if (id in entities) {
                    let pos = simToMap(data.details.pos);
                    let e = document.getElementById("point_" + id);
                    e.setAttribute("cx", pos[0]);
                    e.setAttribute("cy", pos[2]);
                    if ($("#entitySelect").val() == id) {
                        movePinToId(id);
                    }
                }
            } else if (data.event == "RemoveEntity") {
                removeEntity(data.details.id);
            } else {
                console.log(data);
            }
        }
    }
} catch (exception) {
    alert('<p>Error' + exception);
}

function mapToSim(coords) {
    return [
        (coords[0] / parseFloat($("#map").width()) * (max.x - min.x)) + min.x,
        coords[1],
        (coords[2] / parseFloat($("#map").height()) * (max.z - min.z)) + min.z
    ]
}

function simToMap(coords) {
    return [
        (coords[0] - min.x) / (max.x - min.x) * parseFloat($("#map").width()),
        coords[1],
        (coords[2] - min.z) / (max.z - min.z) * parseFloat($("#map").height())
    ]
}

// this functon is taken from main.js to add entities to dropdown box
function addEntity(data) {
    const coords = simToMap(data.pos);
    entities[data.details.id] = data;

    // Wait to fade out the popup until the last drone comes in.
    if (new_dispatch_list.length > 0 && data.details.type == "drone") {
        // add drone details to drone log here
        $("#list").append(
            "<div>Drone \"" + data.details.name
            + "\", ID: " + data.details.id
            + ", created at ("
            + Math.trunc(coords[0]) + ", " + Math.trunc(coords[2])
            + ")</div>"
        );
        new_dispatch_list.pop();
        if (new_dispatch_list.length == 0) {
            document.getElementById("msg").textContent = "Drones have been dispatched!";
            $("#popup").fadeOut(5000);
            document.getElementById("dispatch").setAttribute("value", "Dispatch");
            $("#dispatch").prop('disabled', false);
        }
    }

    $("#entitySelect").append($(
        '<option id="select_' + data.details.id
        + '" value="' + data.details.id + '">'
        + data.details.id + ": "
        + data.details.name
        + " (" + data.details.type + ")"
        + '</option>'
    ));

    $("#map").append($(
        '<circle id="point_' + data.details.id
        + '" cx="' + coords[0]
        + '" cy="' + coords[2]
        + '" r="5" stroke="white" stroke-width="2" fill="lightgreen" />'
    ));
    $("#map").html($("#map").html());

    // the loader will report the loading progress to this function
    const onProgress = () => { };

    // the loader will send any error messages to this function, and we'll log
    // them to to console
    const onError = (errorMessage) => { console.log(errorMessage); };
}

// This function dispatches a drone and sends the command to the web sockets api.
function dispatch() {
    $("#dispatch").prop('disabled', true);
    $("#dispatch").prop("value", "Dispatching, please wait...");

    let name = $("#name").val();
    if (name == "") {
        name = $("#name").attr("placeholder");
    }

    // Show popup
    $("#msg").textContent = "Dispatching drones...";
    $("#popup").show();

    $.getJSON("assets/model/drone.json", function (data) {
        // adds a default location if one is not selected
        if (new_dispatch_list.length == 0) {
            let pos = simToMap(data["position"]);
            new_dispatch_list.push([pos[0], pos[2]]);
        }

        // creates drone with info here
        for (let i = 0; i < new_dispatch_list.length; i++) {
            data["name"] = name;
            data["position"] = mapToSim([
                new_dispatch_list[i][0],
                253.883,
                new_dispatch_list[i][1]
            ]);
            api.sendCommand("CreateEntity", data);
        }

        // Remove only the temporary points
        document.querySelectorAll('.new').forEach(e => e.remove());
        $("#name").val("");
    });
}

// Sends the request to the back-end server
function deleteEntity() {
    // Disable the drop-down
    $("#delete").prop('disabled', true);
    document.getElementById("delete").setAttribute("value", "Removing entity...");
    $("#entitySelect").prop('disabled', true);

    // Send the event to server
    let id = parseInt($("#entitySelect").val());
    if (id > -1) {
        api.sendCommand("DeleteEntity", { "details": { "id": id } });
    }
}

// Handles the removal request from the server
function removeEntity(id) {
    let drone_name = $("#select_" + id).html();

    // Remove the entity
    $("#select_" + id).remove();
    $("#point_" + id).remove();
    $("#pin").hide();
    delete entities[id];

    // Re-enable the drop-down
    $("#entitySelect").prop('disabled', false);
    $("#delete").prop('disabled', false);
    document.getElementById("delete").setAttribute("value", "Remove Entity");

    // add drone details to drone log here
    $("#list").append(
        "<div>" + drone_name + " removed</div>"
    );
}

function selectEntity(id) {
    if (id >= 0) {
        // Move the pin and show it
        movePinToId(id);
        $("#pin").show();
    } else {
        $("#pin").hide();
    }
}

function movePinToId(id) {
    document.getElementById("pin").setAttribute(
        "transform",
        "translate("
            + $("#point_" + id).attr("cx") + ", "
            + (parseFloat($("#point_" + id).attr("cy")) - 15)
        + ")"
    );
}
