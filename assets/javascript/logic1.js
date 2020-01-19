// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAHl2SQb-A64VUZVNtENXq9E6LBqIkJMlA",
    authDomain: "train-scheduler-89897.firebaseapp.com",
    databaseURL: "https://train-scheduler-89897.firebaseio.com",
    projectId: "train-scheduler-89897",
    storageBucket: "",
    messagingSenderId: "1064244848276"
  };

  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding train info
$("#add-train-btn").on("click", function (event) {

    event.preventDefault();

    // Grabs new train info from user input fields
    var trainName = $("#name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainFirst = $("#firstTrain-input").val().trim();
    var trainFreq = $("#frequency-input").val().trim();

    // Object for storing new train info
    var newTrain = {
        name: trainName,
        destination: trainDest,
        firstTime: trainFirst,
        frequency: trainFreq
    };

    // Pushed train info into Firebase
    database.ref().push(newTrain);

    alert("New Train successfully added");

    // Clears all input fields
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");

});

// 3. Create a way to retrieve train info from the train database.

// Firebase method used to trigger a function when new child is added to database
database.ref().on("child_added", function (childSnapshot) {

    // Stores retrieved data into variables
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var tFirstTime = childSnapshot.val().firstTime;
    var tFreq = childSnapshot.val().frequency;

    // Format first train entry and convert it to 1 year ago
    var tFirstTimeConv = moment(tFirstTime, "HH:mm").subtract(1, "years");

    // Grabs current time
    var currentTime = moment();

    // Calculates the difference between current time and first time variable 
    var diffTime = currentTime.diff(moment(tFirstTimeConv), "minutes");

    // Finds the remainder between differnce in time and frequency for next arrival
    var tRemainder = diffTime % tFreq;

    // Subtracts remainder from frequency to calculate minutes til next arrival
    var tMinutesTillTrain = tFreq - tRemainder;

    // Adds minutes til next train to current time to calculate next arrival
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");

    
    // Create new row in Display Div
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(tFreq),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain)
    );

    // Appends new row containing new train info to table
    $("#train-table > tbody").append(newRow);


});