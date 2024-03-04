import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import io from "socket.io-client";
import './Dashboard.css';
import { ENDPOINT } from '../config-react.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

let socket;

const Dashboard = () => {
  const [statistics, setStatistics] = useState({total_users: 0, total_rooms: 0, total_messages: 0});

  var data = {
    datasets: [
      {
        label: 'Daily Messages',
        backgroundColor: '#00a884',
        borderColor: '#00a884',
        data: statistics.daily_messages
      }
    ]
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    // save statistics to state machine
    socket.on("statistics", ({statistics}) => {
      setStatistics(statistics);
    });

    // fetch statistics at startup
    socket.emit("statistics");

    // fetch statistics once per minute (debug: once per second)
    const interval = setInterval(() => {
      socket.emit("statistics");
    }, 1*1000);
    return () => clearInterval(interval);

  }, []);
  
  return (
    <div className="wrapper-container">
      <nav className="navbar navbar-expand-lg navbar-hi5 navbar-light ">
        <Link className="navbar-brand display-3" to="/">
          <div className="navbar-brand display-3">Hi5</div>
        </Link>
        <ul className="navbar-nav ml-auto mr-4">
          <div className="row">
            <li className="nav-item active">
              <a className="nav-link h3" href="/dashboard">
                <img className="icon-width" src={process.env.PUBLIC_URL + "/icon-dashboard.svg"} alt="Dashboard" title="Dashboard"/>
              </a>
            </li>
            <li className="nav-item active pl-4">
              <a className="nav-link h3" href="/">
                <img className="icon-width" src={process.env.PUBLIC_URL + "/icon-back.svg"} alt="Home" title="Home"/>
              </a>
            </li>
          </div>
        </ul>
      </nav>
      <div className="row">
        <div className="col-12 mb-5 display-1 pt-5" align="center">Dashboard</div>
      </div>
      <div className="container px-4">
        <div className="row gx-5">
          <div className="total-users-container col-md-6 col-sm-12 col-lg-4 mb-3">
            <div className="small-container">
              <div className="row">
                <img className="user-icon mx-auto d-block col-6" src={process.env.PUBLIC_URL + "/icon-user.svg"} alt=" "/> 
                <div className="col-6">
                  <div className="total-users-count display-3">{statistics.total_users}</div>
                  <div className="total-users-text statistics-label">Total Users</div>
                </div>
              </div>
            </div>
          </div>
          <div className="total-rooms-container col-md-6 col-sm-12 col-lg-4 mb-3">
            <div className="small-container">
              <div className="row">
                <img className="room-icon mx-auto d-block col-6" src={process.env.PUBLIC_URL + "/icon-room.svg"} alt=" "/>
                <div className="col-6">
                  <div className="total-rooms-count display-3">{statistics.total_rooms}</div>
                  <div className="total-rooms-text statistics-label">Total Rooms</div>
                </div>
              </div>      
            </div>
          </div>
          <div className="total-messages-container col-md-12 col-sm-12 col-lg-4 mb-3">
            <div className="small-container">
              <div className="row">
                <img className="message-icon mx-auto d-block col-6" src={process.env.PUBLIC_URL + "/icon-message.svg"} alt=" "/>
                <div className="col-6">
                  <div className="total-messages-count display-3">{statistics.total_messages}</div>
                  <div className="total-messages-text statistics-label">Total Messages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="daily-messages-container col-12 mt-5">
          <div className="daily-messages-text display-4 mb-3">Daily Messages</div>
          <div className="chartjs-container">
            <Bar data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
