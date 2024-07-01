import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {
  Button,
  Input,
  Row,
  Card,
  Container,
  List,
  ListGroupItem,
  CardHeader,
  CardBody,
} from "reactstrap";
import { sendMessage } from "@microsoft/signalr/dist/esm/Utils";
import { Columns } from "react-bootstrap-icons";

export default function ChatComponent() {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const createConnection = async () => {
    try {
      const connection = new HubConnectionBuilder().withUrl("/chatHub").build();

      connection.on("ReceiveMessage", (user, message) => {
        setMessages((messages) => [...messages, { user, message }]);
        console.log("messages");
      });

      // connection.on("UsersInRoom", (users) => {
      //   setUsers(users);s
      // });

      // connection.onclose(e => {
      //   setConnection();
      //   setMessages([]);
      //   setUsers([]);
      // });
      console.log();
      connection.start().then(() => setConnection(connection));
      // await connection.invoke("JoinRoom", { user, room });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    createConnection();
  }, []);

  const sendMessage = async () => {
    const response = await fetch("Customer");
    const data = await response.json();

    try {
      await connection.invoke("SendMessage", user, message);
      console.log(messages);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Container>
        <Row>
          <label>Користувач</label>
          <Input type="text" onChange={(e)=> setUser(e.target.value)} ></Input>
        </Row>
        <Row>
          <label>Повідомлення</label>
          <Input type="text" onChange={(e)=> setMessage(e.target.value)}></Input>
        </Row>
        <Button className="mt-3" onClick={sendMessage}>
          Надіслати
        </Button>
        <Button className="mt-3" onClick={()=> setMessages([])}>
          Очистити
        </Button>
        <Row className="pt-3">
          {messages.map((item, index) => (
            <Card key={index}>
              <CardHeader>{item.user}</CardHeader>
              <CardBody>{item.message}</CardBody>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
}
