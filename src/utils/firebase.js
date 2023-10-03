import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC8AJqik7TuHqicWnp-9QtLXmaUcwD3MRY',
  authDomain: 'educational-chatbot-mana-c3f12.firebaseapp.com',
  projectId: 'educational-chatbot-mana-c3f12',
  storageBucket: 'educational-chatbot-mana-c3f12.appspot.com',
  messagingSenderId: '33137782688',
  appId: '1:33137782688:web:197432838841d3256e7ec5',
  measurementId: 'G-XBQE2LY9QH',
  databaseURL:
    'https://educational-chatbot-mana-c3f12-default-rtdb.firebaseio.com/',
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export default database;
