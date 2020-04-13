import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Button,
  Input,
  Alert,
} from "reactstrap";
import AppNavbar from "menu/AppNavbar";
import "css/App.css";
import Constant from "common/Constant";
import axios from "axios";
import EmpleadoDesc from "common/EmpleadoDesc";
import { validateRequired } from "common/Validator";

const PATH_UBICACION_SERVICE =
  Constant.EMPLEADO_API + Constant.UBICACION_SERVICE;

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

    this.setState(fields);
  };

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
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
    this.setState({ errors: errors, formState: formState });
    return formState == !"invalid";
  }

  save = async () => {
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
        .then(result => this.setState({ isLoading: false, formState: "saved" }))
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
      return <p>Loading...</p>;
    }

    let messageLabel;
    if (formState == "invalid") {
      messageLabel = <Alert color="danger">El fomulario tiene errores</Alert>;
    } else if (formState == "saved") {
      messageLabel = (<Alert color="success">La ubicacion fue guardada satisfactoriamente</Alert>);
    } else if (formState == "error") {
      messageLabel = (<Alert color="danger">{error.response.data.message}</Alert>);
    }

    let messageNombre;
    if (errors["nombre"]) {
      messageNombre = (
        <Alert color="danger">{this.state.errors["nombre"]}</Alert>
      );
    }

    let messageDireccion;
    if (errors["direccion"]) {
      messageDireccion = (
        <Alert color="danger">{this.state.errors["direccion"]}</Alert>
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
              <FormGroup>
                <Label for="nombre">Nombre</Label>
                <Input
                  ref="nombre"
                  type="text"
                  size="30"
                  placeholder="Nombre de la obra u oficina"
                  value={this.state.fields.nombre}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "nombre");
                  }}
                />
                {messageNombre}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="direccion">Direccion</Label>
                <Input
                  ref="direccion"
                  type="text"
                  size="70"
                  placeholder="Direccion de la obra u oficina"
                  value={this.state.fields.direccion}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "direccion");
                  }}
                />
                {messageDireccion}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="Tipo">Tipo</Label>
                <Input
                  type="select"
                  ref="tipo"
                  value={this.state.fields.tipo}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "tipo");
                  }}
                >
                  <option value="OBRA">OBRA</option>
                  <option value="OFICINA">OFICINA</option>
                </Input>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="descripcion">Descripcion</Label>
                <textarea
                  ref="descripcion"
                  cols={70}
                  rows={3}
                  maxLength={300}
                  placeholder="descripcion"
                  value={this.state.fields.descripcion}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "descripcion");
                  }}
                />
              </FormGroup>
            </Col>
            {ingeniero}
            {oficial}
            <FormGroup>
              <Button color="primary" onClick={this.save}>
                Guardar
              </Button>{" "}
              <Button color="secondary" tag={Link} to="/ubicaciones">
                Regresar
              </Button>{" "}
              <Button color="secondary" onClick={this.resetForm}>
                Nuevo
              </Button>
            </FormGroup>
            <Col>{messageLabel}</Col>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(UbicacionEdit);
