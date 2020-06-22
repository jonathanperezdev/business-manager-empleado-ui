import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Col,
  Form,
  Button,  
  Alert
} from "react-bootstrap";
import AppNavbar from "menu/AppNavbar";
import "css/App.css";
import Constant from "common/Constant";
import axios from "axios";
import EmpleadoDesc from "common/EmpleadoDesc";
import { validateRequired } from "common/Validator";
import Loading from 'common/Loading';

const PATH_UBICACION_SERVICE = Constant.EMPLEADO_API + '/ubicacion';

class UbicacionEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: { nombre: "", direccion: "", tipo: "OBRA", descripcion: "" },
      errors: {},
      formState: "",
    };
  }

  resetForm = () => {
    let { fields } = this.state;

    fields.nombre = "";
    fields.direccion = "";
    fields.tipo = "OBRA";
    fields.descripcion = "";

    this.setState({fields: fields, formState: 'new'});
  };

  async componentDidMount() {
    if (this.props.match.params.id != "new") {
      axios
        .get(PATH_UBICACION_SERVICE + `/${this.props.match.params.id}`)
        .then((result) =>
          this.setState({ fields: result.data, formState: "success" })
        )
        .catch((error) =>
          this.setState({
            error,
            formState: "error",
            isLoading: false,
          })
        );
    }
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {
      nombre: validateRequired(fields.nombre, "nombre"),
      direccion: validateRequired(fields.direccion, "direccion"),
    };
    let formState = "";

    if (errors.nombre || errors.direccion) {
      formState = "invalid";
    }
    this.setState({ errors: errors, formState: formState, isLoading: false });
    return formState == !"invalid";
  }

  save = async () => {
    this.setState({isLoading: true});

    const fields = this.state.fields;
    const id = fields.id;

    if (this.handleValidation()) {
      await axios({
        method: id ? "PUT" : "POST",
        url: id ? PATH_UBICACION_SERVICE + "/" + id : PATH_UBICACION_SERVICE,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(fields) })
        .then(result => this.setState({ isLoading: false, formState: 'saved' }))
        .catch(error => this.setState({ error, formState: "error", isLoading: false}))
    }
  };

  handleChange = (valor, field) => {
    let { fields } = this.state;
    fields[field] = valor;
    this.setState(fields);
  };

  render() {
    const { fields, formState, errors, error, isLoading} = this.state;

    if (isLoading) {
      return  <Loading/> 
    }

    let messageLabel;

    if (formState == "error") {
      messageLabel = (<Alert variant="danger">{error.response.data.message}</Alert>);
    }else if (formState == "invalid") {
      messageLabel = <Alert variant="danger">El fomulario tiene errores</Alert>;
    } else if (formState == "saved") {
      messageLabel = (<Alert variant="success">La ubicacion fue guardada satisfactoriamente</Alert>);
    }
    
    let messageNombre;
    if (errors["nombre"]) {
      messageNombre = (
        <Alert variant="danger">{this.state.errors["nombre"]}</Alert>
      );
    }

    let messageDireccion;
    if (errors["direccion"]) {
      messageDireccion = (
        <Alert variant="danger">{this.state.errors["direccion"]}</Alert>
      );
    }   

    let ingeniero;
    if (this.state.fields.ingeniero) {
      ingeniero = (
        <EmpleadoDesc
          title="Ingeniero A Cargo"
          employee={this.state.fields.ingeniero}
        />
      );
    }

    let oficial;
    if (this.state.fields.oficial) {
      oficial = (
        <EmpleadoDesc
          title="Oficial A Cargo"
          employee={this.state.fields.oficial}
        />
      );
    }   

    const id = fields["id"];
    const title = <h2>{id ? "Modificar Ubicacion" : "Agregar Ubicacion"}</h2>;

    return (
      <div>
        <AppNavbar />
        <Container className="App">
          {title}
          <Form className="form">
            <Col>
              <Form.Group controlId='ubicacion.nombre' >
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  size="30"
                  placeholder="Nombre de la obra u oficina"
                  value={this.state.fields.nombre}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "nombre");
                  }}
                />
                {messageNombre}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='ubicacion.direccion'>
                <Form.Label>Direccion</Form.Label>
                <Form.Control                  
                  type="text"
                  size="70"
                  placeholder="Direccion de la obra u oficina"
                  value={this.state.fields.direccion}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "direccion");
                  }}
                />
                {messageDireccion}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='ubicacion.tipo'>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  as="select"                  
                  value={this.state.fields.tipo}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "tipo");
                  }}
                >
                  <option value="OBRA">OBRA</option>
                  <option value="OFICINA">OFICINA</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='ubicacion.descripcion'>
                <Form.Label>Descripcion</Form.Label>
                <textarea
                  cols="70"
                  rows="3"
                  maxLength="300"
                  placeholder="descripcion"
                  value={this.state.fields.descripcion}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "descripcion");
                  }}
                />
              </Form.Group>
            </Col>
            {ingeniero}
            {oficial}
            <Form.Group>
              <Button variant="outline-primary" disabled={formState=='saved'} onClick={this.save}>
                Guardar
              </Button>{" "}
              <Button variant="outline-secondary" href="/ubicaciones">
                Regresar
              </Button>{" "}
              <Button variant="outline-secondary" onClick={this.resetForm}>
                Nuevo
              </Button>
            </Form.Group>
            <Col>{messageLabel}</Col>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(UbicacionEdit);
