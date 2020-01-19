var firebaseConfig = {
    apiKey: "AIzaSyCYiedM0qrXX7-lPJCHeKV35FYYWc4X5Ms",
    authDomain: "train-54419.firebaseapp.com",
    databaseURL: "https://train-54419.firebaseio.com",
    projectId: "train-54419",
    storageBucket: "train-54419.appspot.com",
    messagingSenderId: "221637515378",
    appId: "1:221637515378:web:33745b6d8210776ff04aeb",
    measurementId: "G-7PX9DSBQRW"
  };
  
  firebase.initializeApp(firebaseConfig);

var database=firebase.database();

$("#add-train-btn").on("click",function(event){
      event.preventDefault();

      var trainName = $("#name-input").val().trim();
      var trainDest = $("#destination-input").val().trim();
      var trainfirst = $("#firstTrain-input").val().trim();
      var trainfreq = $("#frequency-input").val().trim();

 var newTrain = {
     name:trainName,
     destination:trainDest,
     firstTime:trainfirst,
     frequency:trainfreq
 };

 database.ref().push(newTrain);

 $("#name-input").val("");
 $("#destination-input").val("");
 $("#firstTrain-input").val("");
 $("#frequency-input").val("");

});

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

