if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('sw.js') // Register the service worker
  .then(registration => {
  // Ask for notification permission
   Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
  // Get the user's subscription details
   registration.pushManager.subscribe({ userVisibleOnly: true })
  .then(subscription => {
  // Send the subscription details to your server to store
  console.log('Subscription details:', subscription);
  });
  }
  });
  })
   .catch(error => {
   console.error('Service worker registration failed:', error);
  });
  }
  // Function to send a notification from your server
  function sendNotification(subscription, payload) {
  // Use your server-side code to send the notification to the user's subscription
  // This typically involves making a POST request to a push service with the subscription details and payload
  }