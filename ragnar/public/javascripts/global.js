var liveInfoDefault = {
  actualStart : null,
  currentLegStartTime : null,
  currentTotalTime : 0,
  currentLegIndex : 0,
  currentRotationIndex : 0,
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
  /* TODO: KILL ALL THIS */  
  // Populate the team table on initial page load
  populateTable();
  // Teamname link click
  $('#teamList table tbody').on('click', 'td a.linkshowteam', showTeamInfo);    
  // Add Team button click
  $('#btnAddTeam').on('click', addTeam);  
  // Delete Team link click
  $('#teamList table tbody').on('click', 'td a.linkdeleteteam', deleteTeam);
  resetApp();
  /* TODO: END KILL ALL THIS */
  
  // Start race button click
  $('#btnStart').on('click', startRace);     
  $('#btnReset').on('click', resetApp);     
  $('#btnNext').on('click', nextRunner);
  updateClock();
  window.setInterval(updateClock, 1000);
});


// Actions ===============================================================
function startRace() {
  // TODO: This should save information back to database
  liveInfo.actualStart = new Date();  
  liveInfo.currentLegStartTime = liveInfo.actualStart;
}

function resetApp() {
  // TODO: This should save the default state back to the database;
  liveInfo = {};
  $.extend(liveInfo,liveInfoDefault);
}

function nextRunner() {  
  // Set completion time
  var currentTime = new Date();  
  var legCompletionTime = Math.abs((currentTime.getTime() - liveInfo.currentLegStartTime.getTime()))/1000;
   
  // Update Info    
  liveInfo.legCompletionTime[liveInfo.currentLegIndex, liveInfo.currentRotationIndex] = legCompletionTime;
  liveInfo.currentTotalTime += legCompletionTime;
  liveInfo.currentLegStartTime = currentTime;      
  liveInfo.currentLegIndex++;
  if (liveInfo.currentLegIndex == 12) {
    liveInfo.currentRotationIndex++;
    liveInfo.currentLegIndex = 0;    
  }  
  
  updateClock();
  // TODO: This should save information back to database  
}

// Functions =============================================================
function getCurrentVan() {
  if (liveInfo.currentLegIndex <= 5) return 1;
  return 2;
}

function getCurrentRunner() {
  return teamInfo.runner[liveInfo.currentLegIndex];
}

function updateClock() {
  var timeString = '';
  var messageString = '';  
  var messageString2 = '';  
  if (liveInfo.actualStart == null) {
    messageString = 'Time to Apocalypse'
    timeString = getTimeString(teamInfo.raceStart, new Date())
  }
  else {        
    messageString = getCurrentRunner().name + ' Runs';
    messageString2 = 'Van: ' + getCurrentVan() + ' Leg: ' + ((liveInfo.currentLegIndex + 1) + 12 * liveInfo.currentRotationIndex);
    timeString = getTimeString(new Date(), liveInfo.currentLegStartTime)
  }
  
  $('#bigmessage').html(messageString);
  $('#bigmessage2').html(messageString2);
  $('#bigtime').html(timeString);
}

function padTimeNumber(num) {
    var s = "0" + num;
    return s.substr(s.length-2);
}

function getTimeString(highTime, lowTime) {
  var difference = highTime - lowTime;
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

// Fill table with data
function populateTable() {
  // Empty content string
  var tableContent = '';
  // jQuery AJAX call for JSON
  $.getJSON( '/teams', function( data ) {
    // Stick our team data array into a teamlist variable in the global object
    teamListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td class="text-cell"><a href="#" class="linkshowteam" rel="' + this.name + '" title="Show Details">' + this.name + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteteam btn btn-danger" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#teamList table tbody').html(tableContent);
  });
};

// Show Team Info
function showTeamInfo(event) {
  // Prevent Link from Firing
  event.preventDefault();
  // Retrieve teamname from link rel attribute
  var thisTeamName = $(this).attr('rel');
  // Get index of object based on id value
  var arrayPosition = teamListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisTeamName);
  // Get our Team Object
  var thisTeamObject = teamListData[arrayPosition];
  //Populate Info Box
  $('#teamInfoName').text(thisTeamObject.name);
}

// Add Team
function addTeam(event) {
  event.preventDefault();  
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addTeam input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });
  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    // If it is, compile all user info into one object
    var newTeam = {
      'name': $('#addTeam fieldset input#inputTeamName').val()
    }
    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newTeam,
      url: '/addteam',
      dataType: 'JSON'
    }).done(function( response ) {
      // Check for successful (blank) response
      if (response.msg === '') {
        // Clear the form inputs
        $('#addTeam fieldset input').val('');
        // Update the table
        populateTable();
      }
      else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Delete Team
function deleteTeam(event) {
  event.preventDefault();
  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this team?');
  // Check and make sure the user confirmed
  if (confirmation === true) {
    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/deleteteam/' + $(this).attr('rel')
    }).done(function( response ) {
      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }
      // Update the table
      populateTable();
    });

  }
  else {
    // If they said no to the confirm, do nothing
    return false;
  }
};