import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import queryString from "query-string";
import io from "socket.io-client";
import './Chat.css'
import { ENDPOINT, URI } from '../config-react.js'

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [pokerState, setPokerState] = useState(false);
  const [is_master, setIsMaster] = useState(false);
  const [has_voted, setHasVoted] = useState(false);

  const messages_end_ref = useRef(null)

  function scroll_to_bottom() {
    messages_end_ref.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scroll_to_bottom, [messages]);
  useEffect(scroll_to_bottom, [pokerState]);

  useEffect(() => {
    // get username and roomname from url
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setRoom(room);
    setName(name);

    // join the room 
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [location.search]);

  useEffect(() => {
    // receive messages from server
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    // receive "start planning poker" from server
    socket.on("start_poker", () => {
      setPokerState(true);
    });

    // receive "end planning poker" from server 
    socket.on("end_poker", () => {
      setPokerState(false);
      setHasVoted(false);
    });
  }, []);

  // send message to server
  function send_message(e) { 
    e.preventDefault();
    if (message) {
      if(message.startsWith("#")) {
        setIsMaster(true);
      }
      socket.emit("sendMessage", { message });
      setMessage("");
    }
  }; 

  // send poker value to server
  function send_poker_value(value) {
    socket.emit("set_poker_value", value);
    setHasVoted(true);
  }

  // end planning poker
  function end_poker() {
    setIsMaster(false);
    setPokerState(false);    
    socket.emit("end_poker");
  }

  // crc32 hashing algorithm (minified version)
  function crc32(r) {
    for(var a,o=[],c=0;c<256;c++){a=c;for(var f=0;f<8;f++) a=1&a?3988292384^a>>>1:a>>>1;o[c]=a;}
    for(var n=-1,t=0;t<r.length;t++) n=n>>>8^o[255&(n^r.charCodeAt(t))];
    return(-1^n)>>>0;
  }

  return (
    <div className="fullscreen">
      <div className="row nav-div">
        <div className="col-2 menu hide-sd">
          <div className="display-3 pl-2" align="center">Hi5</div>
        </div>
        <div className="col-8 menu text-sizing">
          <div className="display-4 pt-4 pl-2" align="center">{room} (Logged in as {name})</div> 
        </div>
        <div className="col-4 col-md-2 menu">
          <div className="row flex-nowrap mt-3 responsive-padding">
            <CopyToClipboard text={`${URI}/invite/${room}`}>
              <button className="button-copy-invite-link  btn btn-square-md" title="Copy invite link">
                <img src={process.env.PUBLIC_URL + "/icon-copy.svg"} className="icon-width" alt="Copy Invite Link" />
              </button>
            </CopyToClipboard>
            <Link to={`/home/${name}`}>
              <button className="button-home btn btn-square-md">
                <img src={process.env.PUBLIC_URL + "/icon-back.svg"} className="icon-width" alt="Home" title="Home"/>
              </button> 
            </Link>
          </div>
        </div>
      </div>
      <div className="row chat-div">
        <div className="col-sm-0 col-md-2 chat-border flex-column"></div>
        <div className="col-sm-12 col-md-8 chat">
          <div className="row">
            <div className="col-12">
              {messages.map((val, i) => {
                if (val.user === name) {
                  return (
                    <div key={i} className="chat-message-own">
                      {/*<b>{val.user}</b>
                      <br /> */}
                      <div>
                        {val.text.split("\n").map((val2, j) => {
                          return (
                            <div key={i+"m"+j}>
                              {val2}
                              <br />
                            </div>
                          );
                        })}
                      </div>
                    </div> 
                  );
                } else {
                  return (
                    <div key={i} className={`chat-message message-color-${crc32(val.user) % 10}`}>
                      <b>{val.user}</b>
                      <br />
                      <div>
                        {val.text.split("\n").map((val2, j) => {
                          return (
                            <div key={i+"m"+j}>
                              {val2}
                              <br />
                            </div>
                          );
                        })}
                      </div>
                    </div> 
                  );
                }
              })}
          
              <div align="center">
                {pokerState && !has_voted && (
                  <div>
                    <div className="label-poker-heading">Bitte geben Sie Ihre Wertung ab:</div>
                    <div className="pokerLabel pb-3"> 
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(0)}>0</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(0.5)}>{"\u00BD"}</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(1)}>1</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(2)}>2</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(3)}>3</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(5)}>5</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(8)}>8</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(10)}>10</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(13)}>13</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(20)}>20</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(40)}>40</button>
                      <button className="button-planning-poker btn btn-light" onClick={() => send_poker_value(100)}>100</button>
                    </div> 
                  </div> 
                )}
                {is_master && pokerState && (
                  <button className="button-end-planning-poker btn btn-light" onClick={() => end_poker()}>Abstimmung beenden</button>
                )}
                <div ref={messages_end_ref} className="bottom-of-messages"/>
              </div>
            </div>
          </div>
        </div>
        <div className="col-2 chat-border"></div>
      </div>
      <div className="row send-message-div bottom-of-messages" align="bottom">
        <div className="col-md-2 col-sm-1 chat-border flex-column hide-sd"></div>
        <div className="message pb-4 col-md-8 col-sm-10">
          <div className="mt-2 ml-4">
            <form onSubmit={send_message}>
              <div className="input-group">
                <input className="form-control ol-6" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <div className="input-group-append">
                  <button type="submit" className="btn button-send mr-4">
                    <img className="img-send" src={process.env.PUBLIC_URL + "/icon-send.svg"} alt="Senden" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-2 col-sm-1 chat-border flex-column hide-sd"></div>
      </div>
    </div>
  );
};

export default Chat;
