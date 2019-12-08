import PushNotification from 'react-native-push-notification';

export default class NotifService {
  constructor(onRegister, onNotification) {
    this.configure(onRegister, onNotification);
  }

  configure(onRegister, onNotification, gcm = '') {
    PushNotification.configure({
      onRegister: onRegister,
      onNotification: onNotification,
      senderID: gcm,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  localNotif(message) {
    PushNotification.localNotification({
      message: message,
    });
  }

  scheduleNotif(notifTime, notifMessage, notifNumber) {
    PushNotification.localNotificationSchedule({
      message: notifMessage,
      date: notifTime,
      userInfo: {id: notifNumber},
      id: notifNumber,
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif(number) {
    PushNotification.cancelLocalNotifications({
      id: number,
    });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}
