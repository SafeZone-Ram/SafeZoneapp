
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  // Function to handle form submission
  function handleLoginFormSubmission(event) {
    event.preventDefault();
    
    // Check username and password
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    // Simulated login validation (replace with actual authentication logic)
    if (username === 'user' && password === 'password') {
      // Redirect to main page after successful login
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('main-page').style.display = 'block';
      initializeSafetyAlarm();
    } else {
      // Display login error message
      loginError.textContent = 'Invalid username or password. Please try again.';
    }
  }

  // Add event listener to the login form
  loginForm.addEventListener('submit', handleLoginFormSubmission);
});

let safetyAlarmActivated = false;
let recognition;
let sirenSound;

// Function to initialize safety alarm and voice recognition
function initializeSafetyAlarm() {
  // Pre-load the siren sound
  sirenSound = new Audio('C:\\Users\\Hp\\OneDrive\\Desktop\\siren.mp3.wav');
  sirenSound.loop = true;
  sirenSound.volume = 0.5;
  sirenSound.load();

  // Initialize voice recognition
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.onstart = function() {
    console.log('Voice recognition activated.');
  };
  
  recognition.onresult = function(event) {
    const last = event.results.length - 1;
    const command = event.results[last][0].transcript;
    console.log('Voice Command:', command);
    
    if (command.toLowerCase() === 'help') {
      triggerAlarm();
      displayStatusMessage("<p style='font-size: 10px; line-height: 1.5; padding: 10px; font-weight: bold; color: red;'>Sending GPS location and audio/video messages to emergency contacts, nearby police stations, and nearby hospitals: <span id='location'></span></p>");
      notifyEmergencyContacts('emergency');
      document.body.style.backgroundImage = "url('https://i.postimg.cc/prmRVXX7/Page2.png')";
    } else if (command.toLowerCase() === 'caution') {
      document.body.style.backgroundColor = 'orange';
      displayStatusMessage("<p style='font-size: 10px; line-height: 1.5; padding: 10px; font-weight: bold;color:orange;'>Sending GPS location and audio/video messages to emergency contacts: <span id='location'></span></p>");
      notifyEmergencyContacts('caution');
      document.body.style.backgroundImage = "url('https://i.postimg.cc/dQ9JFpQw/page3.png')";
    } else if (command.toLowerCase() === 'update') {
      document.body.style.backgroundColor = 'green';
      displayStatusMessage("<p style='font-size: 10px; line-height: 1.5; padding: 10px; font-weight: bold; color: green;'>Sending GPS location to emergency contacts: <span id='location'></span></p>");
      notifyEmergencyContacts('update');
      document.body.style.backgroundImage = "url('https://i.postimg.cc/tC1Ww3yd/last-page.png')";
    }
    getLocation();
  };
}

// Function to toggle the safety alarm
function toggleSafetyAlarm() {
  if (!safetyAlarmActivated) {
    startSafetyAlarm();
  } else {
    stopSafetyAlarm();
  }
}

// Function to start the safety alarm
function startSafetyAlarm() {
  safetyAlarmActivated = true;
  document.getElementById('toggle-btn').innerText = 'Stop';
  document.getElementById('status-messages').innerHTML = '';
  
  if (recognition) {
    recognition.start();
  }
  
  if (sirenSound) {
    sirenSound.play();
  }
}

// Function to stop the safety alarm
function stopSafetyAlarm() {
  safetyAlarmActivated = false;
  document.getElementById('toggle-btn').innerText = 'Start';
  document.body.style.backgroundColor = '#ffffff';
  document.getElementById('status-messages').innerHTML = '';
  document.body.style.backgroundImage = "url('https://i.postimg.cc/s2WsQtTv/appmainpage.png')";
  
  if (recognition) {
    recognition.stop();
  }
  
  if (sirenSound) {
    sirenSound.pause();
  }

  // Show logout button
  document.getElementById('logout-btn').style.display = 'block';
}

// Function to trigger the alarm
function triggerAlarm() {
  document.body.style.backgroundColor = 'red';
  
  if (sirenSound) {
    sirenSound.play();
  }
  
  alert('Safety alarm activated! Help is on the way.');
}

// Function to notify emergency contacts
function notifyEmergencyContacts(type) {
  const emergencyContacts = ['911', 'Friend 1', 'Friend 2', 'Family Member'];
  
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    emergencyContacts.forEach(contact => {
      let message = '';
      if (type === 'emergency') {
        message = `Emergency! I need help! My current location: ${locationUrl}`;
      } else if (type === 'caution') {
        message = `Caution! I'm in a potentially unsafe situation! My current location: ${locationUrl}`;
      } else if (type === 'update') {
        message = `Update! I'm safe now. My current location: ${locationUrl}`;
      }

      console.log(`Notification sent to ${contact}: ${message}`);
    });
  }, error => {
    console.error('Error getting location:', error);
  });
}

// Function to show status messages in the background
function displayStatusMessage(message) {
  document.getElementById('status-messages').innerHTML = message;
}

// Function to get current location and update status messages
function getLocation() {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const locationSpan = document.getElementById('location');
    locationSpan.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
  }, error => {
    console.error('Error getting location:', error);
  });
}

// Function to logout
function logout() {
  // Show login page and hide main page
  document.getElementById('login-page').style.display = 'block';
  document.getElementById('main-page').style.display = 'none';

  // Reset safety alarm and status messages
  stopSafetyAlarm();
}
