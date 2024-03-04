import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Home.css';
import { URI } from "../config-react.js";

const Home = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  var get_name = window.location.href.split("/").slice(-1);
  if (get_name.includes(URI)) { 
    get_name = "";
  }

  function create_new_room() {
    if (name === "") {
      setName(get_name);
    }
  }

  function validate_roomname(e) {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setRoom(e.target.value);

    if (name === "") {
      setName(get_name);
    }
  }

  function validate_username(e) {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setName(e.target.value); 
  }

  return (
    <div className="standart">
      <nav className="navbar navbar-expand-lg navbar-hi5 navbar-light">
        <a className="navbar-brand display-3" href="/">Hi5</a>
        <ul className="navbar-nav ml-auto mr-4">
          <div className="row">
            <li className="nav-item active">
              <a className="nav-link h3" href="/dashboard">
                <img className="icon-width" src={process.env.PUBLIC_URL + "/icon-dashboard.svg"} alt="Dashboard" title="Dashboard"/>
              </a>
            </li>
            <li className="nav-item active pl-4">
              <a className="nav-link h3" href="/welcome">
                <img className="img-fluid icon-width" src={process.env.PUBLIC_URL + "/icon-info.svg"} alt="Welcome" title="Welcome"/>
              </a>
            </li>
          </div>
        </ul>
      </nav>
      <div className="wrapper fadeIn Down">   
        <div className="form-login">
          <div className="display-3 mb-2 heading-home" align="center">Welcome to Hi5</div>
          <form className="was-validated">
            <div className="row" align="center">
              <div className="col pb-3">
                <input
                  defaultValue={get_name}
                  id="name"
                  className="form-control mt-3"
                  pattern="[A-Za-z0-9]*"
                  placeholder="Username"
                  maxLength="20"
                  onChange={(event) => validate_username(event)}
                  required
                />
                <div className="invalid-feedback pl-1">Username is invalid!</div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 font-weight-bold" align="center">or</div>
            </div>
            <div className="row" align="center">
              <div className="col border-right border-dark">
                <div>
                  <input
                    className="form-control mt-3"
                    pattern="[A-Za-z0-9]*"
                    placeholder="Room"
                    maxLength="50"
                    type="text"
                    onChange={(event) => validate_roomname(event)}
                  />
                </div>
                <Link
                  onClick={(e) => (name == "" || !room ? e.preventDefault() : null)}
                  to={`/chat?name=${name}&room=${room}`}
                >
                  <button className="btn btn-dark mt-3" type="submit">Join Room</button>
                </Link>
              </div>
              <div className="col mb-0">
                <Link
                  onClick={(e) => (name == "" ? e.preventDefault() : null)}
                  to={`/chat?name=${name}&room=room-${Math.floor(Math.random() * (999999999 - 100000000) + 100000000)}`}
                >
                  <button className="btn btn-dark mt-3" onMouseEnter={() => create_new_room()}>Create New Room</button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
