import queryString from "query-string";

import io from "socket.io-client";
import React, { useEffect, useState } from "react";

import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

// const ENDPOINT = 'https://chat-app12344.herokuapp.com/';
const ENDPOINT = "https://chat-app12344.herokuapp.com/";

let socket;

export default function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // const { name, room } = queryString.parse(location.search);
  console.log(name, room);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (name11) => {
      // if(name11) {
      //   alert(name11);
      // }
    });

    return () => {
      socket.emit("disconnected");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on(
      "message",
      (message) => {
        // message is the sended things from socket.emit{'message'}
        // in server side

        setMessages((messages) => [...messages, message]);
        console.log(messages)


        // 🚀🚀 message ----> {user: 'admin', text: 'maher, welcome to room actions.'}
        console.log(message);
      },
      [messages]
    );
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();


    
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
}
