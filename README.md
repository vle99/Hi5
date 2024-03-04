# Hi5

## 1. Installation Guide
### 1.1 Datenbank
- MySQL Database
- `create database hi5;`
- `create user 'hi5_user'@'%' identified by 'mySuperSecurePassword';`
- `grant all privileges on hi5.* to 'hi5_user'@'%';`
- `flush privileges;`
- `create table user (id int auto_increment primary key, username varchar(200) not null unique);`
- `create table room (id int auto_increment primary key, roomname varchar(200) not null unique);`
- `create table message (id int auto_increment primary key, datum datetime not null, user_id int not null, room_id int not null, message varchar(10000), foreign key (user_id) references user(id), foreign key (room_id) references room(id));`

### 1.2 App
- Node + Node Packet Manager (npm) installieren
- Setup ausführen und Pakete installieren: `npm run setup`
- App starten: `npm run dev`
