import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyC2lGfv19kaemnXfCNFHxlid0lOsHfMxuQ',
	authDomain: 'dexbooru.firebaseapp.com',
	databaseURL: 'https://dexbooru-default-rtdb.firebaseio.com',
	projectId: 'dexbooru',
	storageBucket: 'dexbooru.appspot.com',
	messagingSenderId: '832127545791',
	appId: '1:832127545791:web:e18be421dbac5144bbb10a',
	measurementId: 'G-LJ3FFSEVSF'
};

const firebaseApp = initializeApp(firebaseConfig);

const fireDb = getFirestore(firebaseApp);
//connectFirestoreEmulator(fireDb, 'localhost', 7999);

export default fireDb;
