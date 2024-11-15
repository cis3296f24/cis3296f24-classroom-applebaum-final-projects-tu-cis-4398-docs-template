if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/PWASetUp/service-worker.js')
        .then(registration => console.log('Service Worker registered:', registration))
        .catch(error => console.log('Service Worker registration failed:', error));
}