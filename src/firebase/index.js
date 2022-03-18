import firebase from "firebase/app";
import "firebase/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCq4HKX2yFhAhHjJQHGvLkmGefwXS7jjeU",
//   authDomain: "hr-resourcing-app-10cd0.firebaseapp.com",
//   projectId: "hr-resourcing-app-10cd0",
//   storageBucket: "hr-resourcing-app-10cd0.appspot.com",
//   messagingSenderId: "249594175303",
//   appId: "1:249594175303:web:bbd62270bd0804528e3662",
//   measurementId: "G-N5C69WZRQM",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBZBTjIA1N12p88zcLCVDz-LsQSYS5e9jE",
  authDomain: "resourceapp-1350c.firebaseapp.com",
  projectId: "resourceapp-1350c",
  storageBucket: "resourceapp-1350c.appspot.com",
  messagingSenderId: "648875242050",
  appId: "1:648875242050:web:c269ff221e820bcfce73db",
  measurementId: "G-05CLL2B0MS"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
