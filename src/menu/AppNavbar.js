import React, { Component } from "react";
import { Navbar, NavDropdown } from "react-bootstrap";

export default class AppNavbar extends Component {
  render() {
    return (
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
        <NavDropdown title="Menu">
          <NavDropdown.Item href="/cargos">Cargos</NavDropdown.Item>
          <NavDropdown.Item href="/empleados">Empleados</NavDropdown.Item>
          <NavDropdown.Item href="/ubicaciones">Ubicaciones</NavDropdown.Item>
          <NavDropdown.Item href="/configuraUbicacion/new">Configuracion de Ubicacion</NavDropdown.Item>
        </NavDropdown>        
      </Navbar>
    );
  }
}
