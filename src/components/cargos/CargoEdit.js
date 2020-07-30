import React, { Component } from "react";
import {withRouter } from "react-router-dom";
import {
  Container,
  Col,
  Form,
  Button,  
  Alert
} from "react-bootstrap";
import AppNavbar from "menu/AppNavbar";
import Constant from "common/Constant";
import axios from "axios";
import { validateRequired } from "common/Validator";
import Loading from 'common/Loading';

const PATH_CARGO_SERVICE = Constant.EMPLEADO_API + '/cargo';

class CargoEdit extends Component {
  emptyState = {
    nombre: "",
    descripcion: "",
    funciones: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      fields: this.emptyState,
      errors: {},
      formState: "",
    };
  }

  async componentDidMount() {
    if (this.props.match.params.id != "new") {
      axios.get(PATH_CARGO_SERVICE + `/${this.props.match.params.id}`)
      .then(result => this.setState({ fields: result.data, formState: "success" }))
      .catch(error => this.setState({error, isLoading: false, formState: "error"}));
    }
  }

  resetForm = () => {
    let { fields } = this.state;

    fields.nombre = "";
    fields.descripcion = "";
    fields.funciones = "";

    this.setState({ fields: fields, formState: 'new' });
  };

  handleValidation = () => {
    let { fields } = this.state;
    let errors = { nombre: validateRequired(fields.nombre, "cargo") };
    let formState = "";

    if (errors.nombre || errors.direccion) {
      formState = "invalid";
    }

    this.setState({ errors: errors, formState: formState, isLoading: false });
    return formState == !"invalid";
  };

  save = async () => {
    this.setState({isLoading: true});

    const fields = this.state.fields;
    const id = fields["id"];

    if (this.handleValidation()) {
      await axios({
        method: id ? "PUT" : "POST",
        url: id ? PATH_CARGO_SERVICE + "/" + id : PATH_CARGO_SERVICE,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(fields)})
      .then(result => this.setState({ isLoading: false, formState: "saved" }))
      .catch(error => this.setState({error, isLoading: false, formState: "error",}));  
    }  
  }

  handleChange(value, field) {
    let {fields} = this.state;
    fields[field] = value;
    this.setState(fields);
  }

  render() {
    const { fields, formState, errors, error, isLoading} = this.state;

    if (isLoading) {
      return  <Loading/> 
    }   

    let messageLabel;
    if (formState == "error") {
      messageLabel = (<Alert variant="danger">{error.response.data.message}</Alert>);
    } else if (formState == "invalid") {
      messageLabel = <Alert variant="danger">El fomulario tiene errores</Alert>;
    } else if (formState == "saved") {
      messageLabel = (<Alert variant="success">El cargo fue guardado satisfactoriamente</Alert>);
    }

    let messageNombre;
    if (errors["nombre"]) {
      messageNombre = (
        <Alert variant="danger">{this.state.errors["nombre"]}</Alert>
      );
    }

    const id = fields["id"];
    const title = <h2>{id ? "Modificar Cargo" : "Agregar Cargo"}</h2>;

    return (
      <div>
        <AppNavbar />
        <Container className="App">
          {title}
          <Form className="form">
            <Col>
              <Form.Group controlId="cargo.nombre">
                <Form.Label>Cargo</Form.Label>
                <Form.Control                  
                  size="30"
                  placeholder="Cargo"
                  value={this.state.fields.nombre}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "nombre");
                  }}
                />
                {messageNombre}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="cargo.descripcion">
                <Form.Label>Descripcion</Form.Label>
                <Form.Control as="textarea"                  
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
            <Col>
              <Form.Group controlId="cargo.funciones">
                <Form.Label>Funciones</Form.Label>
                <Form.Control as="textarea" 
                  rows="3"
                  cols="70"
                  maxLength="300"
                  placeholder="funciones"
                  value={this.state.fields.funciones}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "funciones");
                  }}
                />
              </Form.Group>
            </Col>
            <Form.Group controlId="cargo.buttons">
              <Button disabled={formState=='saved'} variant="outline-primary" onClick={this.save}>
                Guardar
              </Button>{" "}
              <Button variant="outline-secondary" href="/cargos">
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

export default withRouter(CargoEdit);
