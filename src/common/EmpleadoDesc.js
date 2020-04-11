import React from 'react';
import { Container, Col, FormGroup, Label, Input, Row} from 'reactstrap';

const EmpleadoDesc = ({title, employee}) => {
  return (
    <Col>
      <Container className="App">
        <h5>{title}</h5>
        <Row form>
          <Col sm="2">
            <FormGroup>
              <Label>Id</Label>
              <Input type="text"
                disabled
                value={employee.id}/>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="contactoEmergenciaApellidos">Nombres</Label>
              <Input type="text"
                disabled
                value={employee.nombres}/>
            </FormGroup>
          </Col>
          <Col sm="3">
            <FormGroup>
              <Label>Apellidos</Label>
              <Input type="text"
                disabled
                value={employee.apellidos}/>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}

export default EmpleadoDesc;
