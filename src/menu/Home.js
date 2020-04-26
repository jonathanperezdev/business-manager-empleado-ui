import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { Container, Card, CardDeck, Button } from "react-bootstrap";
import employeeImg from 'img/employee.png';
import calendarImg from 'img/calendar.png';
import payrollImg from 'img/payroll.png';

class Home extends Component {
  render() {
    return (
      <div>
        <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="/">          
          <img
            alt=""
            src="/Aurora.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Business Manager
        </Navbar.Brand>
      </Navbar>
        <Container className="welcome">
          <CardDeck>
            <Card>
              <Card.Img variant="top" src={employeeImg}/>
              <Card.Body>
                <Card.Title>Empleado</Card.Title>
                <Card.Text>
                  Permite administrar empleados, cargos y ubicaciones
                </Card.Text>
                <Button variant="primary" href="/empleados">Abrir</Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src={calendarImg}/>
              <Card.Body>
                <Card.Title>Horario</Card.Title>
                <Card.Text>
                  Permite registrar el horario trabajado por empleado
                </Card.Text>                                
                <Button variant="primary">Abrir</Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src={payrollImg}/>
              <Card.Body>
                <Card.Title>Nomina</Card.Title>
                <Card.Text>
                  Liquide la nomina para obtener el valor a pagar                  
                </Card.Text>
                <Button variant="primary">Abrir</Button>                
              </Card.Body>
            </Card>            
          </CardDeck>
        </Container>
      </div>
    );
  }
}

export default Home;
