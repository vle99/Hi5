import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Home.css';

const Invite = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  var get_room = window.location.href.split("/").slice(-1);

  function validate_username(e) {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setName(e.target.value);    
  }

  return (
    <div className="wrapper fadeIn Down">
      <div className="form-login">
        <h1 className="display-3 mb-2 heading-home" align="center">Welcome to Hi5</h1>
        <div className="text-white display-4 pb-2" align="center">You got invited to '{get_room}'. Join now!</div>
        <div className="row">
          <div className="col">
            <form className="was-validated">
              <div>
                <input
                  id="name"
                  className="form-control mt-3"
                  pattern="[A-Za-z0-9]*"
                  placeholder="Username"
                  maxLength="20"
                  type="text"
                  onChange={(event) => {validate_username(event); setRoom(get_room)}}
                  required
                />
                <div className="invalid-feedback pl-1">Username is invalid!</div>
              </div>
              <div align="center">
                <Link
                  onClick={(e) => (!name || !room ? e.preventDefault() : null)}
                  to={`/chat?name=${name}&room=${room}`}
                >
                  <button className="btn btn-dark mt-3" type="submit">Join Room</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Invite;
