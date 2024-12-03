import messaging from '@react-native-firebase/messaging';
import {
  getDataFromCachedWithKey,
  saveDataToCachedWithKey,
} from '../module/cacheData';
import {AppConstants} from '../module';
import notifee, {EventType} from '@notifee/react-native';
import {Add_FCM} from '../services';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    GetFcmToken();
  } else {
    console.log('Not enabled');
  }
}

async function GetFcmToken() {
  let fcmToken = await getDataFromCachedWithKey(
    AppConstants.AsyncKeyLiterals.fcmtoken,
  );
  let userID = await getDataFromCachedWithKey(
    AppConstants.AsyncKeyLiterals.userId,
  );
  console.log('fcmToken from local storage:: ', fcmToken);

  if (
    (!fcmToken || fcmToken == null || fcmToken == undefined) &&
    userID &&
    userID !== null &&
    userID !== undefined
  ) {
    try {
      let fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('fcmToken :: ', fcmToken);
        const newData: any = {
          user_id: userID,
          fcm_token: fcmToken,
        };
        const res: any = await Add_FCM(newData);
        console.log(res);
        saveDataToCachedWithKey(
          AppConstants.AsyncKeyLiterals.fcmtoken,
          fcmToken,
        );
      }
    } catch (error) {
      console.log(error, ' ERROR! Error in FCM TOKEN');
    }
  }
}

async function onDisplayNotification(data: any) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title: data.notification.title,
    body: data.notification.body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}

notifee.onBackgroundEvent(
  async ({type, detail}: {type: EventType; detail: any}) => {
    switch (type) {
      case EventType.PRESS:
        console.log('Notification pressed in background:', detail);
        break;
      case EventType.DISMISSED:
        console.log('Notification dismissed in background:', detail);
        break;
      default:
        break;
    }
  },
);

export function NotificationListener() {
  messaging().onNotificationOpenedApp((remoteMessage: any) => {
    onDisplayNotification(remoteMessage);
    console.log(
      'Notification caused app to open from background state:',
      JSON.stringify(remoteMessage),
    );
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    onDisplayNotification(remoteMessage);
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async (remoteMessage: any) => {
    onDisplayNotification(remoteMessage);
    console.log(
      'Notification on foreground state...............: ',
      JSON.stringify(remoteMessage),
    );
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        onDisplayNotification(remoteMessage);
        console.log(
          'Notification Caused app to open from quiet mode:',
          JSON.stringify(remoteMessage),
        );
      }
    });
}
