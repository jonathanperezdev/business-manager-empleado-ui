import React, { Component } from "react";
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
import Loading from 'common/Loading';
import axios from "axios";

const PATH_EMPLEADO_SERVICE = Constant.EMPLEADO_API + Constant.EMPLEADO_SERVICE;
const PATH_EMPLEADOS_SEARCH_SERVICE =
  Constant.EMPLEADO_API + Constant.EMPLEADOS_SEARCH_SERVICE;
const options = Constant.OPTIONS_TABLE;
const PATH_TIPO_DOCUMENTOS_SERVICE =
  Constant.EMPLEADO_API + Constant.TIPO_DOCUMENTOS_SERVICE;

let rowId = "";

class EmpleadosList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        tipoDocumento: "",
        numeroDocumento: "",
        nombres: "",
        apellidos: "",
      },
      empleados: [],
      isLoading: false,
      error: null,
      isExistData: false,
      formState: "",
      modal: false,
      tipoDocumentos: [],
      firstTipoDocumento: "",
    };
  }

  async componentDidMount() {
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

  searchSubmit = async () => {
    this.setState({ isLoading: true });
    let { fields } = this.state;

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
            error: null,
            formState: "success",
          });
        })
        .catch((error) =>
          this.setState({
            error,
            isLoading: false,
            isExistData: false,
            formState: "error",
          })
        );
    }

    this.resetForm();
  };

  handleChange = (value, field) => {
    let { fields } = this.state;
    fields[field] = value;
    this.setState(fields);
  };

  onRowSelect(row, isSelected, e) {
    rowId = row["id"];
  }

  edit = (id) => {
    let path = `empleado/${id}`;
    this.props.history.push(path);
  };

  create = (path) => {
    this.props.history.push(path);
  };

  resetForm = () => {
    let { fields, firstTipoDocumento } = this.state;

    fields.tipoDocumento = firstTipoDocumento;
    fields.numeroDocumento = "";
    fields.nombres = "";
    fields.apellidos = "";

    this.setState(fields);
  };

  remove = async (id) => {
    await axios({
      method: "DELETE",
      url: PATH_EMPLEADO_SERVICE + `/${id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        let updatedEmpleados = [...this.state.empleados].filter(
          (i) => i.id !== id
        );
        let isExistData = true;

        if (updatedEmpleados.length == 0) {
          isExistData = false;
        }

        this.setState({
          empleados: updatedEmpleados,
          formState: "deleted",
          modal: false,
          isExistData: isExistData,
        });
      })
      .catch((error) =>
        this.setState({
          error,
          isLoading: false,
          formState: "error",
        })
      );
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  render() {
    const {empleados, error, isExistData, formState, fields, tipoDocumentos, firstTipoDocumento, isLoading} = this.state;

    if (isLoading) {
      return  <Loading/> 
    }

    let messageLabel;
    if (formState == "error") {
      messageLabel = (<Alert color="danger">{error.response.data.message}</Alert>);
    } else if (formState == "deleted") {
      messageLabel = (<Alert color="success">El empleado se elimino satisfactoriamente</Alert>);
    } else if (formState == "errorSearch") {
      messageLabel = (<Alert color="danger">Debe ingresar el tipo y numero de documento o nombres y apellidos para poder buscar</Alert>);
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
        dataField: "tipoDocumentoModel.nombre",
        text: "Tipo Documento",
      },
      {
        dataField: "numeroDocumento",
        text: "Numero Documento",
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
      mode: "radio",
      selected: [isExistData ? rowId : 0],
      clickToSelect: true,
      bgColor: "rgb(89, 195, 245)",
      onSelect: this.onRowSelect,
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
        <ModalHeader toggle={this.toggle}>Confirmar Eliminar</ModalHeader>
        <ModalBody>Esta seguro de eliminar el empleado</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.remove(rowId)}>
            Eliminar
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
          <h2>Empleados</h2>
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
                  onClick={(path) => this.create("empleado/new")}
                >
                  Crear
                </Button>
                {"    "}
                <Button
                  color="primary"
                  disabled={!this.state.isExistData}
                  onClick={(id) => this.edit(rowId)}
                >
                  Modificar
                </Button>
                {"    "}
                <Button
                  color="primary"
                  disabled={!this.state.isExistData}
                  onClick={this.toggle}
                >
                  Eliminar
                </Button>
                {"    "}
                <Button color="primary" onClick={this.resetForm}>
                  Nueva Busqueda
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

export default EmpleadosList;
