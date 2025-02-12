self.addEventListener('push', event => {

    const data = event.data.json();
  const title = data.title;
  const body = data.body;
  self.registration.showNotification(title, {
  body: body,
  icon: 'path/to/icon.png' // Optional icon
  });
  });
  // Optional: handle click event on notification
  self.addEventListener('notificationclick', event => {
  // Redirect to specific page based on the notification
  event.notification.close();
  });