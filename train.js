var config = {
    apiKey: "AIzaSyBwfIAk3R8aoZzk8qucn0bfjCRFR0RoEqQ",
    authDomain: "hnin-firebase-project.firebaseapp.com",
    databaseURL: "https://hnin-firebase-project.firebaseio.com",
    projectId: "hnin-firebase-project",
    storageBucket: "",
    messagingSenderId: "706524440349"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database
  var database = firebase.database();

  var train = {
      name : "",
      destination : "",
      firstTrain : "",
      freqency : 0
  }

  $("#add-train").on("click", function() {
    event.preventDefault();
    train.name = $("#train-name").val().trim();
    train.destination = $("#train-destination").val().trim();
    train.firstTrain = $("#first-train").val().trim();
    train.freqency = $("#frequency").val().trim();

    database.ref().push({
        name : train.name,
        destination : train.destination,
        firstTrain : train.firstTrain,
        freqency : train.freqency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

database.ref().orderByChild("dateAdded").limitToLast(15).on("child_added",function(childSnapshot){
    var tr = $("<tr>");
    var td_name = $("<td>").text(childSnapshot.val().name);
    var td_destination = $("<td>").text(childSnapshot.val().destination);
    var td_freq = $("<td>").text(childSnapshot.val().freqency);

    var obj = calculateNextArrival(childSnapshot.val().firstTrain, childSnapshot.val().freqency);
    var td_minAway = $("<td>").text(obj.minutesAway);

    var td_nextTrain = $("<td>").text(obj.nextTrain);
    tr.append(td_name).append(td_destination).append(td_freq).append(td_nextTrain).append(td_minAway);
    $("#train-data").append(tr);

},function(errorObject){
    console.log("Error occured: " + errorObject.code);
});

function calculateNextArrival(firstTrain, frequency){
    // Current Time
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    //console.log("now : " + now);

    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    var obj = {
        nextTrain : moment(nextTrain).format("hh:mm"),
        minutesAway : tMinutesTillTrain
    }

    return obj;
}