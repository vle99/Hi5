const http = require("http");
const express = require("express");
const mysql = require("mysql2");
const { add_user, remove_user } = require("./user");

const ip = "http://localhost";

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: `${ip}:3000`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

var poker_values = [];

// establish database connection
const con = mysql.createConnection({
  host: "localhost",
  user: "hi5_user",
  password: "mySuperSecurePassword",
  database: "hi5",
  insecureAuth: true
}); 

// adds a user to the database
function save_user(username) {
  const sql = `insert into user (username) values (${mysql.escape(username)})`;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(result.insertId); 
    }
  });
}

// adds a room to the database
function save_room(roomname) {
  const sql = `insert into room (roomname) values (${mysql.escape(roomname)})`;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(result.insertId); 
    }
  });
}

// adds a message to the database
function save_message(user_id, room_id, message) {
  const sql = `insert into message (user_id, room_id, datum, message) values (${mysql.escape(user_id)}, ${mysql.escape(room_id)}, now(), ${mysql.escape(message)})`;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(result.insertId); 
    }
  });
}

// gets the user_id from a username
function get_user_id(username) {
  return new Promise((resolve, reject) => {
    const sql = `select id from user where username = ${mysql.escape(username)}`;
    con.query(sql, (error, elements) => {
      if(error) {
        console.log(error);
      }
      return resolve(elements[0].id);
    });
  });
}

// gets the room_id from a roomname
function get_room_id(roomname) {
  return new Promise((resolve, reject) => {
    const sql = `select id from room where roomname = ${mysql.escape(roomname)}`;
    con.query(sql, (error, elements) => {
      if(error) {
        console.log(error);
      }
      return resolve(elements[0].id);
    });
  });
}

// gets the <limit> most recent messages from a given room
function get_messages(room_id, limit) {
  if (limit == null) limit = 100;
  return new Promise((resolve, reject) => {
    const sql = `select x.message, x.username from (select m.message, u.username, m.datum from message m left join user u on (m.user_id = u.id) where m.room_id = ${mysql.escape(room_id)} order by m.datum desc limit ${mysql.escape(limit)}) x order by x.datum asc`;
    con.query(sql, (error, elements) => {
      if(error) {
        return console.log(error);
      }
      return resolve(elements);
    });
  });
}

// deletes all messages from a specific room
function delete_messages(room_id) {
  const sql = `delete from message where room_id = ${mysql.escape(room_id)}`;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(result); 
    }
  });
}

// gets the total count of users
function get_total_users() {
  return new Promise((resolve, reject) => {
    const sql = `select count(*) as count from user`;
    con.query(sql, (error, elements) => {
      if(error) {
        return console.log(error);
      }
      return resolve(elements[0].count);
    });
  });
}

// gets the total count of rooms
function get_total_rooms() {
  return new Promise((resolve, reject) => {
    const sql = `select count(*) as count from room`;
    con.query(sql, (error, elements) => {
      if(error) {
        return console.log(error);
      }
      return resolve(elements[0].count);
    });
  });
}

// gets the total count of messages
function get_total_messages() {
  return new Promise((resolve, reject) => {
    const sql = `select count(*) as count from message`;
    con.query(sql, (error, elements) => {
      if(error) {
        return console.log(error);
      }
      return resolve(elements[0].count);
    });
  });
}

// gets an array with daily message counts
function get_daily_messages() {
  return new Promise((resolve, reject) => {
    const sql = `select * from (select date(m.datum) as day, count(m.id) as count from message m group by date(m.datum) order by date(m.datum) desc limit 30) x order by x.day asc`;
    con.query(sql, (error, elements) => {
      if(error) {
        return console.log(error);
      }
      return resolve(elements);
    });
  });
}

// returns a JavaScript object with statistics of Hi5
async function get_statistics() {
  const total_users = await get_total_users();
  const total_rooms = await get_total_rooms();
  const total_messages = await get_total_messages();
  const daily_messages_db_object = await get_daily_messages();

  var daily_messages = [];
  daily_messages_db_object.forEach(m => {
    const date = new Date(m.day);
    const date_formated = `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth()+1)).slice(-2)}.${date.getFullYear()}`; // format: dd.mm.yyyy
    daily_messages.push({
      x: date_formated,   // x: date ('x' because of chart.js)
      y: m.count          // y: daily messages ('y' because of chart.js)
    });
  });

  return { 
    total_users: total_users, 
    total_rooms: total_rooms, 
    total_messages: total_messages, 
    daily_messages: daily_messages 
  };
}

io.on("connection", (socket) => {
  // when a user joins a room
  socket.on("join", ({ name, room }, callBack) => {
    const { user, error } = add_user({ id: socket.id, name, room });
    if (error) return callBack(error);

    socket.join(user.room);

    // saves username and room in database
    save_user(user.name);
    save_room(user.room);

    // query user_id from database
    var user_id;
    get_user_id(user.name).then(result_user_id => {
      user_id = result_user_id;
      console.log(user_id);
    });

    // query room_id from database
    var room_id; 
    get_room_id(user.room).then(result_room_id => {
      room_id = result_room_id;
      console.log(room_id);

      // query and print last messages when joining a room
      get_messages(room_id).then(result_messages => {
        result_messages.forEach(m => {
          socket.emit("message", {
            user: m.username,
            text: m.message
          });
        });
      });
    });

    // system output when joining a room
    /*socket.emit("message", {
      user: "System",
      text: `Connected to room "${user.room}"`
    });*/

    // when user sends a message
    socket.on("sendMessage", ({ message }) => {
      // detect beginning of Planning Poker ('#' at the beginning of a message)
      if(message.startsWith('#')) {
        io.to(user.room).emit("message", {
          user: "Planning Poker",
          text: message.substring(1)
        });
        io.to(user.room).emit("start_poker");
      } 
      // regular message 
      else {
        io.to(user.room).emit("message", {
          user: user.name,
          text: message
        });
        // saves message in the database
        save_message(user_id, room_id, message);
      }
    });

    // saves the value which has been voted by the user in Planning Poker
    socket.on("set_poker_value", (value) => {
      poker_values.push(value);
    });

    // end of Planning Poker
    socket.on("end_poker", () => {
      // calculating results
      const sum = poker_values.reduce((current_sum, next_value) => current_sum + next_value, 0);
      const avg = sum / poker_values.length;
      const avg_rounded = (Math.round(avg*10)/10).toString().replace(".", ",");
      const min = Math.min(...poker_values).toString().replace(".", ",");
      const max = Math.max(...poker_values).toString().replace(".", ",");

      // send results
      io.to(user.room).emit("message", {
        user: "Planning Poker",
        text: `Abstimmung beendet!
        Abgegebene Stimmen: ${poker_values.length}
        Durchschnitt: ${avg_rounded}
        Minimum / Maximum: ${min} / ${max}`
      });

      // reset Planning Poker
      io.to(user.room).emit("end_poker");
      poker_values = [];
    });
  });

  // when user disconnects 
  socket.on("disconnect", () => {
    remove_user(socket.id);
  });

  // get statistics for dashboard
  socket.on("statistics", () => {
    get_statistics().then(statistics => {
      io.emit("statistics", {
        statistics: statistics
      });
    });
  });
});

// start server
server.listen(5000, () => console.log("Server is listening on port 5000."));
