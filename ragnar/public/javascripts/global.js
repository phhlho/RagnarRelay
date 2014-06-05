var liveInfoDefault = {
  raceStart : null,
  currentLegStartTime : null,
  // BEGIN kill these
  currentLegIndex : 0,
  currentRotationIndex : 0,
  currentTotalTime : 0,
  // END kill these
  legCompletionTime : [
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1]
  ]
};

var liveInfo = {};

var raceInfo = {
  legDistance : [
    [5.8,4.2,4.6],
    [4.5,4.5,6.2],
    [2.7,5.4,5.6],
    [7.6,4.8,7.7],
    [6.3,3.8,5.5],
    [9.6,3.1,5.3],
    [7.3,5.4,6],
    [2.9,5.1,5.2],
    [6.9,5.3,4.2],
    [5.6,4,3.7],
    [5.8,7.3,5],
    [6.8,4.5,9.4]
  ],
  legElevation : [
      [5.8,4.2,4.6],
      [4.5,4.5,6.2],
      [2.7,5.4,5.6],
      [7.6,4.8,7.7],
      [6.3,3.8,5.5],
      [9.6,3.1,5.3],
      [7.3,5.4,6],
      [2.9,5.1,5.2],
      [6.9,5.3,4.2],
      [5.6,4,3.7],
      [5.8,7.3,5],
      [6.8,4.5,9.4]
    ]  
};
    
var teamInfo = {
  raceStart : new Date(2014, 5, 6, 9, 30, 0, 0),  
  runner : [
    {
      name : 'Tina',
      pace : '9:30',
      paceMilliseconds : 570000
    },
    {
      name : 'Brock',
      pace : '8:00',
      paceMilliseconds : 510000
    },
    {
      name : 'Christine',
      pace : '10:00',
      paceMilliseconds : 600000
    },
    {
      name : 'Phil',
      pace : '7:30',
      paceMilliseconds : 450000
    },
    {
      name : 'Brian',
      pace : '9:00',
      paceMilliseconds : 510000
    },
    {
      name : 'Deanna',
      pace : '8:45',
      paceMilliseconds : 525000
    },
    {
      name : 'Lori',
      pace : '8:00',
      paceMilliseconds : 480000
    },
    {
      name : 'Edwin',
      pace : '8:45',
      paceMilliseconds : 525000
    },
    {
      name : 'Caroline',
      pace : '8:05',
      paceMilliseconds : 480000
    },
    {
      name : 'Katie',
      pace : '8:47',
      paceMilliseconds : 540000
    },
    {
      name : 'Meaghan',
      pace : '9:40',
      paceMilliseconds : 585000
    },
    {
      name : 'Anthony',
      pace : '7:30',
      paceMilliseconds : 465000
    }
  ]    
}

// DOM Ready =============================================================
$(document).ready(function() {  
  getInfo();  
  // Start race button click
  $('#btnReset').on('click', resetApp);     

  $(document).on('tap click', '#btnStartRace', startRace);
  $(document).on('tap click', '#btnNextRunner', nextRunner);
  $(document).on('tap click', '.list-group-item-success', function(){ alert('tap'); });
  window.setInterval(updateClock, 1000);
});


// Actions ===============================================================
function woah() {
  alert('woah');
}
function startRace() {  
  liveInfo.raceStart = new Date();  
  liveInfo.currentLegStartTime = liveInfo.raceStart;
  
  saveInfo(liveInfo);
}

function resetApp() {
  liveInfo = {};
  $.extend(liveInfo,liveInfoDefault);  
  saveInfo(liveInfoDefault);
}

function nextRunner() {  
  // Set completion time
  var currentTime = new Date();  
  var legCompletionTime = Math.abs((currentTime.getTime() - liveInfo.currentLegStartTime.getTime()));
   
  // Update Info    
  liveInfo.legCompletionTime[liveInfo.currentLegIndex][liveInfo.currentRotationIndex] = legCompletionTime;
  liveInfo.currentTotalTime += legCompletionTime;
  liveInfo.currentLegStartTime = currentTime;      
  liveInfo.currentLegIndex++;
  if (liveInfo.currentLegIndex == 12) {
    liveInfo.currentRotationIndex++;
    liveInfo.currentLegIndex = 0;    
  }  
  
  updateClock();
  saveInfo(liveInfo);
}

// Commands =============================================================
function getInfo() {
  $.getJSON( '/getInfo', function( data ) {
    liveInfo = data[0];
    liveInfo.raceStart = liveInfo.raceStart ? new Date(liveInfo.raceStart) : null;
    liveInfo.currentLegStartTime = liveInfo.currentLegStartTime ? new Date(liveInfo.currentLegStartTime) : null;
  });
}

function saveInfo(info) {
  $.ajax({
    type: 'POST',
    data: info,
    url: '/saveInfo',
    dataType: 'JSON'
  }).done(function( response ) {
    // Check for successful (blank) response
    if (response.msg === '') {      
    }
    else {
      // If something goes wrong, alert the error message that our service returned
      alert('Error: ' + response.msg);
    }
  });  
}

// Functions
function getCurrentVan() {
  if (liveInfo.currentLegIndex <= 5) return 1;
  return 2;
}

function getCurrentRunner() {
  return teamInfo.runner[liveInfo.currentLegIndex];
}

function updateClock() {
  populateList();
  if (liveInfo.raceStart == null) {
    $('#bigtime').html(getTimeDifferenceString(teamInfo.raceStart, new Date()));
  }  
}

function padTimeNumber(num) {
    var s = "0" + num;
    return s.substr(s.length-2);
}

function getTimeDifferenceString(highTime, lowTime) {
  var difference = highTime - lowTime;
  return getTimeString(difference);
}

function getTimeString(totalMilliseconds) {
  var difference = totalMilliseconds;
  var hourMultiple = 1000 * 60 * 60
  var hours = Math.floor(difference / hourMultiple);
  difference -= (hours * hourMultiple);
  var minutesMultiple = 1000 * 60;
  var minutes = Math.floor(difference / minutesMultiple);
  difference -= (minutes * minutesMultiple);
  var secondsMultiple = 1000;
  var seconds = Math.floor(difference / secondsMultiple);    
  var result = padTimeNumber(minutes) + ':' + padTimeNumber(seconds);  
  if (hours > 0) result = '' + hours + ':' + result;
  return result;
}

function getETADateTimeString(predictedDateTime) {
  return 'Jun ' + predictedDateTime.getDate() + ' ' + predictedDateTime.getHours() + ':' + predictedDateTime.getMinutes();
}

// Fill list with data
function populateList() {
  if (liveInfo === null) return;
  var html = "";  
  var lastWasCompleted = false;  
  var currentRunnerTimeString = null;
  var trackingDateTime = moment(teamInfo.raceStart);
  
  for (var legIndex = 0; legIndex < 3; legIndex++) {
    for (var runnerIndex = 0; runnerIndex < 12; runnerIndex++)  {
      var legHtml = '';
      
      var completionTime = liveInfo.legCompletionTime[runnerIndex][legIndex];
      var legMileage = raceInfo.legDistance[runnerIndex][legIndex];
      var completedRunner = (completionTime >= 0);
      var currentRunner = (liveInfo.raceStart !== null && completionTime === -1 && (lastWasCompleted || legIndex === 0 && (runnerIndex == 0)));
      var theRunner = teamInfo.runner[runnerIndex];
      var vanNumber = runnerIndex > 5 ? 2 : 1;
      var runnerNumber = vanNumber === 2 ? runnerIndex - 5 : runnerIndex + 1;      
      var legNumber = (runnerIndex + 1) + 12 * (legIndex);      
      
      // Runner details            
      // Top header
      legHtml += '<h3 class="list-group-item-heading" style="float:left">' + teamInfo.runner[runnerIndex].name + '</h3>';      
      legHtml += '<span class="label label-primary label-margin" style="float:right">Leg ' + legNumber + '</span>';      
      legHtml += '<span class="label label-primary label-margin" style="float:right">Van ' + vanNumber + '</span>';
      legHtml += '<div style="clear:both;"></div>'
      
      // Right
      var data = "";
      var extraClass = "";
      if (completedRunner) {
        data = getTimeString(completionTime);    
        trackingDateTime = moment(teamInfo.raceStart).add('milliseconds', completionTime);          
      }
      else if (currentRunner) {
        currentRunnerTimeString = getTimeDifferenceString(new Date(), liveInfo.currentLegStartTime); 
        data = ''; // blank data here because it's dynamic, so we need to check it after cache check
        extraClass = "current-runner";
        trackingDateTime.add('milliseconds', theRunner.paceMilliseconds * legMileage);
        legHtml += '<button type="button" id="btnNextRunner" class="btn btn-success">Leg Complete</button>'
      }
      else {                
          data = trackingDateTime.format('MMM D h:mm a');                  
          trackingDateTime.add('milliseconds', theRunner.paceMilliseconds * legMileage);
        if (legIndex === 0 && runnerIndex === 0) {legHtml += '<button type="button" id="btnStartRace" class="btn btn-success">Start The Race!</button>';}
      }
      legHtml += '<h3 class="list-group-item-heading ' + extraClass + '" style="float:right">' + data + '</h3>';      
      
      if (completedRunner) {
        legHtml += '<div style="clear:both;"></div>'
        var millisecondsPerMile = completionTime / legMileage;
        var paceString = getTimeString(millisecondsPerMile);
        legHtml += '<h3 class="list-group-item-heading" style="float:right">Pace:' + paceString + '</h3>';
      }
      legHtml += '<div style="clear:both;"></div>'
      
      // Set class item
      var listGroupItemClass = 'list-group-item';     
      // Set class item to green       
      // Set current runner class to yellow
      if (currentRunner) {        
        listGroupItemClass += ' list-group-item-warning';        
      }
      if (completedRunner) {
        listGroupItemClass += ' list-group-item-success';
        lastWasCompleted = true;
      }
      else {lastWasCompleted = false;}
      
      // add list group wrapper
      legHtml = '<div class="' + listGroupItemClass + '">' + legHtml + '</div>';

      html += legHtml;      
    }
  }
  $('.current-runner').each(function(index) {$(this).text('')});
  if ($('#infoList').html() != html) {$('#infoList').html(html);}
  // Do all live data updates here
  $('.current-runner').each(function(index) {$(this).text(currentRunnerTimeString);});
}