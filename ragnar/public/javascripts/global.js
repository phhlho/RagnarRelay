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
    [5.9,4.2,4.6],
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
      name : 'T. Madland',
      pace : '9:30'
    },
    {
      name : 'B. Walter',
      pace : '8:00'
    },
    {
      name : 'C. Schultheis',
      pace : '10:00'
    },
    {
      name : 'P. Heyrman',
      pace : '7:50'
    },
    {
      name : 'B. Belloli',
      pace : '9:00'
    },
    {
      name : 'D. Bordeman',
      pace : '8:45'
    },
    {
      name : 'L. Magnoni',
      pace : '8:00'
    },
    {
      name : 'E. Galarza',
      pace : '8:45'
    },
    {
      name : 'C. Walkinshaw',
      pace : '8:05'
    },
    {
      name : 'K. Lewandroski',
      pace : '8:47'
    },
    {
      name : 'M. Weed',
      pace : '9:40'
    },
    {
      name : 'A. Ewing',
      pace : '7:30'
    }
  ]    
}

// DOM Ready =============================================================
$(document).ready(function() {  
  getInfo();  
  // Start race button click
  $('#btnStart').on('click', startRace);     
  $('#btnReset').on('click', resetApp);     
  $('#btnNext').on('click', nextRunner);
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
    $('#bigmessage').html('Time to Apocalypse');
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

// Fill list with data
function populateList() {
  if (liveInfo === null) return;
  var html = "";  
  var lastWasCompleted = false;
  
  for (var legIndex = 0; legIndex < 3; legIndex++) {
    for (var runnerIndex = 0; runnerIndex < 12; runnerIndex++)  {
      var legHtml = '';
      
      var completionTime = liveInfo.legCompletionTime[runnerIndex][legIndex];
      var completedRunner = (completionTime >= 0);
      var currentRunner = (liveInfo.raceStart !== null && completionTime === -1 && (lastWasCompleted || legIndex === 0 && (runnerIndex == 0)));
      
      // Runner details            '
      legHtml += '<h3 class="list-group-item-heading" style="float:left">' + teamInfo.runner[runnerIndex].name + '</h3>';
      legHtml += '<h3 class="list-group-item-heading" style="float:right">'
      if (completedRunner) {
        legHtml += getTimeString(completionTime);
      }
      else if (currentRunner) {
        legHtml += getTimeDifferenceString(new Date(), liveInfo.currentLegStartTime); 
      }
      else {
        legHtml += 'ETA';
      }
      legHtml += '</h3>';
           
      var vanNumber = runnerIndex > 5 ? 2 : 1;
      var runnerNumber = vanNumber === 2 ? runnerIndex - 5 : runnerIndex + 1;      
      var legNumber = legIndex + 1;
      legHtml += '<div style="clear:both;"></div>'
      
      legHtml += '<span class="label label-primary label-margin" style="float:left">Van ' + vanNumber + '</span>';
      legHtml += '<span class="label label-primary label-margin" style="float:left">Runner ' + runnerNumber + '</span>';
      legHtml += '<span class="label label-primary label-margin" style="float:left">Leg ' + legNumber + '</span>';
      if (completedRunner) legHtml += '<h3 class="list-group-item-heading" style="float:right">PACE</h3>'
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
      legHtml = '<div onclick="woah()" class="' + listGroupItemClass + '">' + legHtml + '</div>';
      
      /*<h4 class="list-group-item-heading">My heading 1</h4><p class="list-group-item-text">My text 1</p><table class="table"><tbody><tr><td>A</td><td>B</td><td>C</td></tr><tr><td>D</td><td>E</td><td>F</td></tr><tr><td>G</td><td>H</td><td>I</td></tr></tbody></table><p></p>
      */
      html += legHtml;      
    }
  }
  $('#infoList').html(html);
}