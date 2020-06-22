import React, { Component } from "react";
import {
  Container,
  Col,
  Form,  
  Button,
  Alert,
  Modal,
  Row  
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import AppNavbar from "menu/AppNavbar";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Constant from "common/Constant";
import Loading from 'common/Loading';
import axios from "axios";

const PATH_EMPLEADO_SERVICE = Constant.EMPLEADO_API+'/empleado';
const PATH_TIPO_DOCUMENTOS_SERVICE = Constant.EMPLEADO_API+'/tipoDocumentos';
const PATH_EMPLEADOS_SEARCH_SERVICE =
  Constant.EMPLEADO_API + '/empleados/search';

const options = Constant.OPTIONS_TABLE;
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
          (i) => i.id != id
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
      messageLabel = (<Alert variant="danger">{error.response.data.message}</Alert>);
    } else if (formState == "deleted") {
      messageLabel = (<Alert variant="success">El empleado se elimino satisfactoriamente</Alert>);
    } else if (formState == "errorSearch") {
      messageLabel = (<Alert variant="danger">Debe ingresar el tipo y numero de documento o nombres y apellidos para poder buscar</Alert>);
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
            <Form.Group>
              <BootstrapTable
                keyField="id"
                data={empleados}
                columns={columns}
                selectRow={selectRow}
                pagination={paginationFactory(options)}
              />
            </Form.Group>
          </Col>
        </div>
      );
    } else {
      tableEmpleado = "";
    }

    const modal = (
      <Modal show={this.state.modal} onClick={this.toggle} className={this.props.className}>
        <Modal.Header onClick={this.toggle}>Confirmar Eliminar</Modal.Header>
        <Modal.Body>Esta seguro de eliminar el empleado</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => this.remove(rowId)}>
            Eliminar
          </Button>{" "}
          <Button variant="outline-secondary" onClick={this.toggle}>
            Cancelar
          </Button>
        </Modal.Footer>
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
              <Row>
                <Col>
                  <Form.Group controlId="empleado.tipoDocumento">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control                      
                      as="select"
                      value={this.state.fields.tipoDocumento}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "tipoDocumento");
                      }}
                    >
                      {optionTipoDocumentos}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="empleado.numeroDocumento">
                    <Form.Label>Numero</Form.Label>
                    <Form.Control                      
                      type="text"
                      size="15"
                      placeholder="Numero de documento"
                      value={this.state.fields.numeroDocumento}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "numeroDocumento");
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="empleado.nombres">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      size="30"
                      placeholder="Nombres del empleado"
                      value={this.state.fields.nombres}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "nombres");
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="empleado.apellidos">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      size="30"
                      placeholder="Apellidos del empleado"
                      value={this.state.fields.apellidos}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "apellidos");
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            {tableEmpleado}
            <Col>
              <Form.Group>
                <Button variant="outline-primary" onClick={this.searchSubmit}>
                  Consultar
                </Button>
                {"    "}
                <Button
                  variant="outline-primary"
                  onClick={(path) => this.create("empleado/new")}
                >
                  Crear
                </Button>
                {"    "}
                <Button
                  variant="outline-primary"
                  disabled={!this.state.isExistData}
                  onClick={(id) => this.edit(rowId)}
                >
                  Modificar
                </Button>
                {"    "}
                <Button
                  variant="outline-secondary"
                  disabled={!this.state.isExistData}
                  onClick={this.toggle}
                >
                  Eliminar
                </Button>
                {"    "}
                <Button variant="outline-primary" onClick={this.resetForm}>
                  Nueva Busqueda
                </Button>
              </Form.Group>
            </Col>
            <Col>{messageLabel}</Col>
          </Form>
        </Container>
      </div>
    );
  }
}

export default EmpleadosList;
