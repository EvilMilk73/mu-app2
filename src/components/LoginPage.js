import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Collapse,
  Card,
  CardBody,
} from "reactstrap";

const Login = (props) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(typeof props.CheckAuth);
    props.CheckAuth(loginData.username, loginData.password);
    console.log("Login data submitted:", loginData);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mt-5 mb-4">Вхід в систему</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="username">Імя</Label>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Введіть ваше імя"
                value={loginData.username}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Пароль</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Введіть ваш пароль"
                value={loginData.password}
                onChange={handleInputChange}
              />
            </FormGroup>

            <Button color="primary" type="submit">
              Вхід
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
