import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Invite from "./components/Invite";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";

const App = () => (
  <Router>
    <Route path="/" exact component={Home} />
    <Route path="/home/:user" exact component={Home} />
    <Route path="/chat" component={Chat} />
    <Route path="/invite/:room" component={Invite}/>
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/welcome" component={Welcome} />
  </Router>
);

export default App;
