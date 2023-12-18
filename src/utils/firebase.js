import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  query,
  orderBy,
} from "firebase/firestore/lite";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
// auth
const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();

let userId = (() => localStorage.getItem("todo-uid"))();

export const createTodoItem = async ({ title, category, priority }) => {
  await setDoc(doc(db, "todos", userId), {});
  await addDoc(collection(db, "todos", userId, "item"), {
    title: title || "",
    priority: priority || -1,
    category: category || "",
    isCompleted: false,
    createTimestamp: serverTimestamp(),
    order: -1,
  });

  // TODO: try catch
};

export const deleteTodoItem = async (docId) => {
  await deleteDoc(doc(db, "todos", userId, "item", docId));
};

export const updateTodoItem = async (docId, values) => {
  await setDoc(doc(db, "todos", userId, "item", docId), values);
};

export const updateTodoList = async (list) => {
  const batch = writeBatch(db);
  let item;
  for (let index = 0; index < list.length; index++) {
    item = list[index];
    batch.update(doc(db, "todos", userId, "item", item.id), {
      category: item.category,
      createTimestamp: item.createTimestamp,
      isCompleted: item.isCompleted,
      title: item.title,
      priority: item.priority,
      order: index + 1,
    });
  }
  await batch.commit();
};

export const getTodoList = async () => {
  /*
  return [
    {
      title: "test async awaittest async await",
      isCompleted: false,
      id: "HNks8edkUM42e4b7ALIx",
      priority: -1,
      createTimestamp: {
        seconds: 1672248848,
        nanoseconds: 823000000,
      },
      category: "learning",
    },
    {
      title: "測試123",
      category: "family",
      id: "JviMn0iLzz1X9e6DUbev",
      createTimestamp: {
        nanoseconds: 379000000,
        seconds: 1672072445,
      },
      priority: -1,
      isCompleted: true,
    },
    {
      title: "11111111",
      createTimestamp: {
        seconds: 1672248831,
        nanoseconds: 633000000,
      },
      isCompleted: false,
      id: "Zk2jt7BwLxOhyN5JOTSc",
      category: "life",
      priority: -1,
    },
    {
      createTimestamp: {
        seconds: 1672248966,
        nanoseconds: 235000000,
      },
      isCompleted: false,
      category: "leisure",
      priority: -1,
      title: "444",
      id: "fPrdTLxJMgpXWFWERr4h",
    },
    {
      isCompleted: false,
      createTimestamp: {
        seconds: 1672248962,
        nanoseconds: 143000000,
      },
      priority: -1,
      title: "222",
      category: "work",
      id: "rbBrxzaUqPvRvth8vkPc",
    },
    {
      title: "111",
      isCompleted: false,
      createTimestamp: {
        seconds: 1672248958,
        nanoseconds: 852000000,
      },
      category: "extrinsic",
      priority: -1,
      id: "vPzJgVIQQBzvyto8JY6u",
    },
    {
      isCompleted: false,
      category: "work",
      title: "列表gogogo",
      priority: -1,
      createTimestamp: {
        seconds: 1672072692,
        nanoseconds: 116000000,
      },
      id: "vXliZEcM0ngNXDH5GE9L",
    },
  ];
  */
  let datas = [];
  const resp = await getDocs(
    query(collection(db, "todos", userId, "item"), orderBy("order", "asc"))
  );
  resp?.forEach((item) => {
    datas.push({
      ...item.data(),
      id: item.id,
    });
  });
  console.log(datas);
  return datas;
};

export const login = async () => {
  return await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      userId = localStorage.getItem("todo-uid");

      return {
        isSucceed: true,
        data: result.user,
      };
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      return {
        isSucceed: false,
        data: { errorCode, errorMessage, email },
      };
    });
};

export const logout = async () => {
  console.log("logout");
  try {
    await signOut(auth);
    return {
      isSucceed: true,
    };
  } catch (e) {
    return {
      isSucceed: false,
    };
  }
};

export default auth;
