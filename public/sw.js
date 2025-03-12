self.addEventListener('install', () => {
    console.info('Service Worker installed.');
});

const sendDeliveryReportAction = () => {
    // fetch('/api/notifications/report', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ status: 'delivered', timestamp: new Date() }),
    // }).then(response => response.json())
    //   .then(data => console.log('Delivery report sent', data))
    //   .catch(error => console.error('Failed to send delivery report'));
    console.log('Notification delivery report');
};

self.addEventListener('push', function (event) {
    if (!event.data) {
        return;
    }

    const payload = event.data.json();
    const { body, icon, image, badge, url, title } = payload;

    const notificationTitle = title ?? 'Welcome to Demo App';
    const notificationOptions = {
        body,
        icon,
        image,
        badge,
        vibrate: [100, 50, 100],
        data: { url },
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions).then(() => {
            sendDeliveryReportAction();
        }),
    );
});

// Handle notification click event (when the user clicks on the notification)
self.addEventListener('notificationclick', function (event) {
    
    const notification = event.notification;
    const url = notification.data?.url ?? '/';

    // Close the notification
    notification.close();

    // Open the URL in the user's default browser
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function (clientList) {
            // Check if there's an open window/tab with the same URL, if so, focus on it
            const alreadyOpen = clientList.find(client => client.url === url);
            if (alreadyOpen) {
                alreadyOpen.focus();
            } else {
                // Otherwise, open a new window/tab
                clients.openWindow(url);
            }
        })
    );
});