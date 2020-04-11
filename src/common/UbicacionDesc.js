import React from 'react';
import { Container, Col, FormGroup, Label, Input, Row} from 'reactstrap';

const UbicacionDesc = ({ubicacion}) => {
  return (
    <Col>
      <Container className="App">
        <h5>Ubicacion</h5>
        <Row form>
          <Col sm="2">
            <FormGroup>
              <Label>Id</Label>
              <Input type="text"
                disabled
                value={ubicacion.id}/>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Nombre</Label>
              <Input type="text"
                disabled
                value={ubicacion.nombre}/>
            </FormGroup>
          </Col>
          <Col sm="3">
            <FormGroup>
              <Label>Tipo</Label>
              <Input type="text"
                disabled
                value={ubicacion.tipo}/>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}

export default UbicacionDesc;
