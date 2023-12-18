import { useState, useEffect } from "react";

import { SemanticToastContainer } from "react-semantic-toasts";

import "./normalize.css";
import "semantic-ui-css/semantic.min.css";
import "./App.scss";

import "./libraries/init";
import authFirebase from "./utils/firebase";
import { TodoList } from "./sections/list";
import Header from "./components/Header";

function App() {
  const [auth, setAuth] = useState({ isLogged: false, uid: "" });

  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
    authFirebase.onAuthStateChanged((user) => {
      if (user) {
        console.log(user.email + " is logged in!");
        setAuth({
          ...user,
          isLogged: true,
          uid: user.email,
        });
        localStorage.setItem("todo-uid", user.email);
      } else {
        setAuth({
          isLogged: false,
          uid: "",
        });
        localStorage.removeItem("todo-uid");
        console.log("User is logged out!");
      }
    });
  }, []);

  return (
    <div className="App">
      <SemanticToastContainer position="top-right" maxToasts={1} />
      <Header isLogged={auth.isLogged} />
      <TodoList isLogged={auth.isLogged} />
    </div>
  );
}

export default App;
