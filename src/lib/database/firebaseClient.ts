import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const FIREBASE_CONFIG = {
	apiKey: 'AIzaSyC2lGfv19kaemnXfCNFHxlid0lOsHfMxuQ',
	authDomain: 'dexbooru.firebaseapp.com',
	databaseURL: 'https://dexbooru-default-rtdb.firebaseio.com',
	projectId: 'dexbooru',
	storageBucket: 'dexbooru.appspot.com',
	messagingSenderId: '832127545791',
	appId: '1:832127545791:web:e18be421dbac5144bbb10a',
	measurementId: 'G-LJ3FFSEVSF'
};

const RECAPTCHA_SITE_KEY = '6Le4F60lAAAAAN0agDhBJH2z8-d50p1MevIDubkE';

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseAppCheck = initializeAppCheck(firebaseApp, {
	provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
	isTokenAutoRefreshEnabled: true
});

const fireDb = getFirestore(firebaseApp);

export default fireDb;
