import React from 'react';
import { Container, Col, Form, Row} from 'react-bootstrap';

const UbicacionDesc = ({ubicacion}) => {
  return (
    <Col>
      <Container className="App">
        <h5>Ubicacion</h5>
        <Row form>
          <Col sm="2">
            <Form.Group>
              <Form.Label>Id</Form.Label>
              <Form.Control type="text"
                disabled
                value={ubicacion.id}/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text"
                disabled
                value={ubicacion.nombre}/>
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Control type="text"
                disabled
                value={ubicacion.tipo}/>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}

export default UbicacionDesc;
