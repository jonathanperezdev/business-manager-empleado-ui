import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Container,
  Col,
  Form,
  FormGroup,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Row,
  Input,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import AppNavbar from "menu/AppNavbar";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Constant from "common/Constant";
import axios from "axios";

const PATH_EMPLEADOS_SEARCH_SERVICE =
  Constant.EMPLEADO_API + Constant.EMPLEADOS_TIPO_UBICACION_SEARCH;
const PATH_UBICACION_SERVICE =
  Constant.EMPLEADO_API + Constant.UBICACION_SERVICE;
const PATH_EMPLEADO_UBICACION_SERVICE =
  Constant.EMPLEADO_API + Constant.EMPLEADOS_UBICACION_SERVICE;
const options = Constant.OPTIONS_TABLE;
const PATH_TIPO_DOCUMENTOS_SERVICE =
  Constant.EMPLEADO_API + Constant.TIPO_DOCUMENTOS_SERVICE;

let rowId = "";

class AddEmpleadoUbicacion extends Component {
  emptyState = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: "",
    apellidos: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      fields: this.emptyState,
      ubicacion: {},
      request: {},
      empleados: [],
      selected: [],
      isLoading: true,
      error: '',
      isExistData: false,
      formState: "",
      modal: false,
      tipoDocumentos: [],
      firstTipoDocumento: ''
    };    
  }

  async componentDidMount() {
    axios
      .get(PATH_UBICACION_SERVICE + `/${this.props.match.params.idUbicacion}`)
      .then((result) => {
        let { request } = this.state;
        request.idUbicacion = this.props.match.params.idUbicacion;
        this.setState({
          ubicacion: result.data,
          request: request,
          isLoading: false,
        });
      })
      .catch((error) =>
        this.setState({
          error,
          isLoading: false,
        })
      );

    axios
      .get(PATH_TIPO_DOCUMENTOS_SERVICE)
      .then((result) => {
        let { fields } = this.state;
        fields.tipoDocumento = result.data[0].id;

        let firstTipoDocumento = result.data[0].id;
        this.setState({
          tipoDocumentos: result.data,
          fields: fields,
          firstTipoDocumento: firstTipoDocumento,
          formState: "success",
        });
      })
      .catch((error) =>
        this.setState({
          error,
          formState: "error",
          isLoading: false,
        })
      );
  }

  addEmpleadoUbicacion = async () => {
    let { request, selected } = this.state;
    request.idEmpleados = selected;

    let params = {idEmpleados: request.idEmpleados, idUbicacion: request.idUbicacion}

    await axios({
      method: "PUT",
      url: PATH_EMPLEADO_UBICACION_SERVICE,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(request)
    }).then(result => this.setState({ isLoading: false}))
      .catch(error =>this.setState({ error, isLoading: false, formState: "error"})
    );

    this.props.history.push(
      `/configuraUbicacion/${this.props.match.params.idUbicacion}`
    );
  }

  searchSubmit = async () => {
    this.setState({ isLoading: true });
    const { fields, ubicacion } = this.state;    

    if (!fields.numeroDocumento && !fields.nombres && !fields.apellidos) {
      this.setState({
        isExistData: false,
        formState: "errorSearch",
        isLoading: false,
      });
    } else {
      await axios
        .get(PATH_EMPLEADOS_SEARCH_SERVICE, {
          params: {
            idUbicacion: ubicacion.id,
            tipoDocumento: fields.tipoDocumento,
            numeroDocumento: fields.numeroDocumento,
            nombres: fields.nombres,
            apellidos: fields.apellidos,
          },
        })
        .then((result) => {
          rowId = result.data[0].id;
          this.setState({
            isLoading: false,
            empleados: result.data,
            isExistData: true,
            formState: 'sucess'
          });
        })
        .catch((error) =>
          this.setState({
            error,
            isLoading: false,
            isExistData: false,
            formState: 'error'
          })
        );
    }
  }

  handleChange = (valor, field) => {
    let {fields} = this.state;
    fields[field] = valor;
    this.setState(fields);
  }

  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id],
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter((x) => x !== row.id),
      }));
    }
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  }

  openModal = () => {
    const { selected } = this.state;
    let modal, formState;

    if (selected.length == 0) {
      modal = false;
      formState = "selectedEmpty";
    } else {
      modal = true;
      formState = "OK";
    }
    this.setState({
      modal: modal,
      formState: formState,
    });
  }

  cancelar = () => {
    this.props.history.push(
      `/configuraUbicacion/${this.props.match.params.idUbicacion}`
    );
  }

  render() {
    const {empleados, isLoading, error, isExistData, formState, ubicacion, fields, tipoDocumentos, firstTipoDocumento} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }
    
    let messageLabel;
    if (formState == "error") {
      messageLabel = (<Alert color="danger">{error.response.data.message}</Alert>);
    } else if (formState == "errorSearch") {
      messageLabel = (<Alert color="danger">Debe ingresar el id, nombres o apellidos para poder buscar</Alert>);
    } else if (formState == "selectedEmpty") {
      messageLabel = (<Alert color="danger">Debe seleccionar minimo un empleado</Alert>);
    }

    let optionTipoDocumentos = tipoDocumentos.map((tipoDocumento) => (
      <option
        key={tipoDocumento.id}
        value={tipoDocumento.id}
        default={fields.id ? fields.tipoDocumento : firstTipoDocumento}
      >
        {tipoDocumento.nombre}
      </option>
    ));

    const columns = [
      {
        dataField: "id",
        text: "Codigo",
        isKey: "true",
      },
      {
        dataField: "nombres",
        text: "Nombres",
      },
      {
        dataField: "apellidos",
        text: "Apellidos",
      },
    ];

    const selectRow = {
      mode: "checkbox",
      clickToSelect: true,
      onSelect: this.handleOnSelect,
      bgColor: "rgb(89, 195, 245)",
    };

    let tableEmpleado;

    if (isExistData) {
      tableEmpleado = (
        <div>
          <Col>
            <FormGroup>
              <BootstrapTable
                keyField="id"
                data={empleados}
                columns={columns}
                selectRow={selectRow}
                pagination={paginationFactory(options)}
              />
            </FormGroup>
          </Col>
        </div>
      );
    } else {
      tableEmpleado = "";
    }

    const modal = (
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>
          Confirmar Agregar Empleados
        </ModalHeader>
        <ModalBody>
          Esta seguro de agregar empleados a la ubicacion {ubicacion.nombre}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addEmpleadoUbicacion}>
            Agregar
          </Button>{" "}
          <Button color="secondary" onClick={this.toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    );

    return (
      <div>
        {modal}
        <AppNavbar />
        <Container className="App">
          <h2>Agregar Empleados a {ubicacion.nombre}</h2>
          <Form className="form">
            <Col>
              <Row form>
              <Col>
                  <FormGroup>
                    <Label for="tipoDocumento">Tipo Documento</Label>
                    <Input
                      ref="tipoDocumento"
                      type="select"
                      value={this.state.fields.tipoDocumento}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "tipoDocumento");
                      }}
                    >
                      {optionTipoDocumentos}
                    </Input>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="numeroDocumento">Numero Documento</Label>
                    <Input
                      ref="numeroDocumento"
                      type="text"
                      size="15"
                      placeholder="Numero de documento"
                      value={this.state.fields.numeroDocumento}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "numeroDocumento");
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="nombres">Nombre</Label>
                    <Input
                      ref="nombres"
                      type="text"
                      size="30"
                      placeholder="Nombres del empleado"
                      value={this.state.fields.nombres}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "nombres");
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="apellidos">Apellidos</Label>
                    <Input
                      ref="apellidos"
                      type="text"
                      size="30"
                      placeholder="Apellidos del empleado"
                      value={this.state.fields.apellidos}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "apellidos");
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            {tableEmpleado}
            <Col>
              <FormGroup>
                <Button color="primary" onClick={this.searchSubmit}>
                  Consultar
                </Button>
                {"    "}
                <Button
                  color="primary"
                  disabled={!this.state.isExistData}
                  onClick={this.openModal}
                >
                  Agregar Empleados
                </Button>
                {"    "}
                <Button color="primary" onClick={this.cancelar}>
                  Cancelar
                </Button>
              </FormGroup>
            </Col>
            <Col>{messageLabel}</Col>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(AddEmpleadoUbicacion);
