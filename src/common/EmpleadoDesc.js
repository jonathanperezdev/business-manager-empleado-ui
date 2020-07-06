import React from 'react';
import { Container, Col, Form, Row} from 'react-bootstrap';

const EmpleadoDesc = ({title, employee}) => {
  return (
    <Col>
      <Container className="App">
        <h5>{title}</h5>
        <Row>
          <Col sm="2">
            <Form.Group>
              <Form.Label>Id</Form.Label>
              <Form.Control 
                disabled
                value={employee.id}/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label for="contactoEmergenciaApellidos">Nombres</Form.Label>
              <Form.Control
                disabled
                value={employee.nombres}/>
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group>
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                disabled
                value={employee.apellidos}/>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}

export default EmpleadoDesc;
