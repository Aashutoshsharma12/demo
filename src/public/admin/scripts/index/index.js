const firebaseConfig = {
    apiKey: "AIzaSyBT_5IZX5AHInqPWzesgS7P_TTubRnkT0Y",
    authDomain: "ssvan-308e4.firebaseapp.com",
    projectId: "ssvan-308e4",
    storageBucket: "ssvan-308e4.appspot.com",
    messagingSenderId: "688808837691",
    appId: "1:688808837691:web:232302995a6677fe1c521e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const FCM_SERVER_KEY = 'AAAAoGA0wjs:APA91bFR7kG2kGzRVgVk_nJ3FKetcx4P77rNblX1zgGj2g8ZPNdf4U6I2kVrgykYfsB4eAX64E2Nm2Vz1hoafVTVq9OjfcZaXJLH8oSrtsQtI7iXIdyxDV-k_YP47oRg7_FpAhPPsgm3'
const VAPID_KEY = 'BNZbQoOrgpAMbyZBp-O3gsFipt0A4XkY0YDf6OcuRxDEPEKJfmHL1Xzzi2TNpW7-zaIeokcLBlXLVuAiWMilBBw'
try {
    if (firebase.messaging.isSupported()) {
        // Need to ask the user for permission
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        // Initialize Firebase
        const messaging = firebase.messaging();
        messaging
        .getToken({
            vapidKey: VAPID_KEY
        })
        .then((currentToken) => {
            if (currentToken) {
                localStorage.setItem("deviceToken", currentToken);
                subscribeTokenToTopic(currentToken, `admin_web_app_development`);
            }
        })
        .catch((err) => {
            console.log('Error to get token', err);
        });
        messaging.onMessage((payload) => {
            console.log("Notification recieved", payload)
            const event = new Event('play-sound');
            document.dispatchEvent(event);
        });
    } else {
        console.log('firebase messaging not supported');
    }
} catch (err) {
    console.log(err);
}

function subscribeTokenToTopic(token, topic) {
    fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
        method: 'POST',
        headers: new Headers({
            Authorization: `key=${FCM_SERVER_KEY}`
        })
    })
    .then((response) => {
        if (response.status < 200 || response.status >= 400) {
            console.log(response.status, response);
        }
        console.log(`"${topic}" is subscribed`);
    })
    .catch((error) => {
        console.error(error.result);
    });
    return true;
}

function unSubscribeFromTopic(topic) {
    const token = localStorage.getItem("deviceToken")
    fetch(`https://iid.googleapis.com/iid/v1:batchRemove`, {
        method: 'POST',
        headers: new Headers({
            Authorization: `key=${FCM_SERVER_KEY}`
        }),
        body: JSON.stringify({
            "to": `/topics/${topic}`,
            "registration_tokens": [token]
        })
    })
    .then((response) => {
        if (response.status < 200 || response.status >= 400) {
            console.log(response.status, response);
        }
        console.log(`"${topic}" unsubscribed`);
        localStorage.removeItem("deviceToken")
    })
    .catch((error) => {
        console.error(error.result);
    });
    return true;
}

navigator.mediaDevices.getUserMedia({ audio: true}).then( stream => {
    window.localStream = stream;
    window.localAudio.srcObject = stream;
    window.localAudio.autoplay = true;
}).catch( err => {
    console.log("u got an error:" + err)
});

document.addEventListener('play-sound', function (e) {
    const audio = new Audio('https://res.cloudinary.com/tecorbssvan/video/upload/v1650879605/sounds/mixkit-happy-bells-notification-937_hghli0.wav');
    audio.play();
}, false);