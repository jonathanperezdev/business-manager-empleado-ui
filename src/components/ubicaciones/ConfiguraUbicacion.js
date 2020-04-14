import React, { Component } from "react";
import {
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Button,
  Input,
  Alert,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import AppNavbar from "menu/AppNavbar";
import Constant from "common/Constant";
import axios from "axios";
const options = Constant.OPTIONS_TABLE;

const PATH_UBICACIONES_SERVICE =
  Constant.EMPLEADO_API + Constant.UBICACIONES_SERVICE;
const PATH_OFICIALES_SERVICE =
  Constant.EMPLEADO_API + Constant.OFICIALES_SEARCH_SERVICE;
const PATH_INGENIEROS_SERVICE =
  Constant.EMPLEADO_API + Constant.INGENIEROS_SEARCH_SERVICE;
const PATH_UBICACION_CONFIGURACION =
  Constant.EMPLEADO_API + Constant.UBICACION_CONFIGURACION;
const FIND_EMPLEADOS_UBICACION =
  Constant.EMPLEADO_API + Constant.EMPLEADO_UBICACION;
const PATH_EMPLEADO_UBICACION_SERVICE =
  Constant.EMPLEADO_API + Constant.EMPLEADOS_UBICACION_SERVICE;  

class ConfiguraUbicacion extends Component {
  emptyState = {
    idUbicacion: "",
    ingenieroACargo: "",
    oficialACargo: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      fields: this.emptyState,
      request: {},
      isLoading: true,
      ubicaciones: [],
      oficiales: [],
      ingenieros: [],
      empleados: [],
      isExistData: false,
      formState: "",
      selected: []
    };
  }

  loadEmpleados(id) {
    axios
      .get(FIND_EMPLEADOS_UBICACION + "/" + id)
      .then((result) => {
        this.setState({
          empleados: result.data,
          isLoading: false,
          isExistData: result.data.length == 0 ? false : true,
          formState: "ok",
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

  async componentDidMount() {
    let {fields} = this.state;

    const id = this.props.match.params.idUbicacion;

    let ubicacion;
    await axios
      .get(PATH_UBICACIONES_SERVICE)
      .then((result) => {
        ubicacion =
          id === "new" ? result.data[0] : result.data.find((x) => x.id == id);
        fields.idUbicacion = ubicacion.id;
        this.setState({
          ubicaciones: result.data,
          isLoading: false,
          formState: "ok",
          selectedUbicacion: result.data[0].id,
          fields: fields,
        });
      })
      .catch((error) =>
        this.setState({
          error,
          isLoading: false,
          formState: "error",
        })
      );

    if (typeof ubicacion !== "undefined" && ubicacion.tipo == "OBRA") {
      await axios
        .get(PATH_OFICIALES_SERVICE)
        .then((result) => {
          fields.oficialACargo = ubicacion.oficialACargo;
          this.setState({
            oficiales: result.data,
            isLoading: false,
            formState: "ok",
            selectedOficial: ubicacion.oficialACargo,
          });
        })
        .catch((error) =>
          this.setState({
            error,
            isLoading: false,
            formState: "error",
          })
        );

      await axios
        .get(PATH_INGENIEROS_SERVICE)
        .then((result) => {
          fields.ingenieroACargo = ubicacion.ingenieroACargo;
          this.setState({
            ingenieros: result.data,
            isLoading: false,
            formState: "ok",
            selectedIngeniero: ubicacion.ingenieroACargo,
          });
        })
        .catch((error) =>
          this.setState({
            error,
            isLoading: false,
            formState: "error",
          })
        );

      this.loadEmpleados(fields.idUbicacion);
    }
  }

  handleUbicacionChange = (valor) => {
    let { fields, ubicaciones } = this.state;

    let ubicacion = ubicaciones.find((x) => x.id == valor);

    fields.idUbicacion = ubicacion.id;
    fields.ingenieroACargo = ubicacion.ingenieroACargo;
    fields.oficialACargo = ubicacion.oficialACargo;

    this.loadEmpleados(fields.idUbicacion);

    this.setState({ fields });
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

  handleChange = (valor, field) => {
    let {fields} = this.state;
    fields[field] = valor;
    this.setState(fields);
  }

  save = async () => {  
    let { fields, ubicaciones } = this.state;

    let ubicacionSelected = ubicaciones.find((x) => x.id == fields.idUbicacion);
    if (ubicacionSelected.tipo === "OFICINA") {
      fields.ingenieroACargo = "";
      fields.oficialACargo = "";
    }

    await axios({
      method: "PUT",
      url: PATH_UBICACION_CONFIGURACION,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(fields) })
      .then(() => {this.setState({formState: "saved", modalSave: false});})
      .catch(error => this.setState({error, isLoading: false, formState: "error", modalSave: false}));
  }

  quitarEmpleados = async () => {
    let { selected, request} = this.state;

    request.idEmpleados = selected;
    request.idUbicacion = '';

    await axios({
      method: "PUT",
      url: PATH_EMPLEADO_UBICACION_SERVICE,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(request) })
      .then(() => {
        let updatedEmpleados = [...this.state.empleados].filter(function (empleado_element) {
          return (
            selected.filter(function (selected_element) {
              return selected_element == empleado_element.id;
            }).length == 0
          );
        });
        let isExistData = true;
    
        if (updatedEmpleados.length == 0) {
          isExistData = false;
        }

        this.setState({empleados: updatedEmpleados, formState: "saved", isExistData: isExistData, modalSave: false});
      })
      .catch(error => this.setState({error, isLoading: false, formState: "error", modalSave: false}));
  }

  toggleSave = () => {
    this.setState({
      modalSave: !this.state.modalSave,
    });
  }

  agregarEmpleados = () => {
    const { fields } = this.state;
    this.props.history.push(`/addEmpleadoUbicacion/${fields.idUbicacion}`);
  }

  render() {
    const {
      error,
      isExistData,
      formState,
      selectedUbicacion,
      selectedOficial,
      selectedIngeniero,
      ubicaciones,
      ingenieros,
      oficiales,
      fields,
      empleados,
      selected,
      isLoading,
    } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    let messageLabel;
    if (formState == "error") {
      messageLabel = (<Alert color="danger">{error.response.data.message}</Alert>);
    } else if (formState == "saved") {
      messageLabel = (<Alert color="success">La ubicacion se guardo satisfactoriamente</Alert>);
    } 

    let optionUbicacion = ubicaciones.map((ubicacion) => (
      <option
        key={ubicacion.id}
        value={ubicacion.id}
        default={selectedUbicacion}
      >
        {ubicacion.nombre}
        {" - "}
        {ubicacion.tipo}
      </option>
    ));

    let optionOficial;
    let optionIngeniero;
    let ingenieroOficialInput;
    let ubicacion = ubicaciones.find((x) => x.id == fields.idUbicacion);

    if (typeof ubicacion !== "undefined" && ubicacion.tipo == "OBRA") {
      optionIngeniero = ingenieros.map((ingeniero) => (
        <option
          key={ingeniero.id}
          value={ingeniero.id}
          default={selectedIngeniero}
        >
          {ingeniero.nombres}
          {" - "}
          {ingeniero.apellidos}
        </option>
      ));

      optionOficial = oficiales.map((oficial) => (
        <option key={oficial.id} value={oficial.id} default={selectedOficial}>
          {oficial.nombres}
          {" - "}
          {oficial.apellidos}
        </option>
      ));

      ingenieroOficialInput = (
        <Col>
          <Row form>
            <Col>
              <FormGroup>
                <Label for="ingenieros">Ingeniero a cargo</Label>
                <Input
                  ref="ingenieros"
                  type="select"                  
                  value={this.state.fields.ingenieroACargo}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "ingenieroACargo");
                  }}
                >
                  <option default={selectedIngeniero} value="null">
                    Seleccionar
                  </option>
                  {optionIngeniero}
                </Input>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="oficiales">Oficial a cargo</Label>
                <Input
                  ref="oficiales"
                  type="select"                  
                  value={this.state.fields.oficialACargo}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "oficialACargo");
                  }}
                >
                  <option default={selectedOficial} value="null">
                    Seleccionar
                  </option>
                  {optionOficial}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Col>
      );
    }

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
            <Container className="App">
              <h5>Eliminar Empleado de Ubicacion</h5>
              <FormGroup>
                <BootstrapTable
                  keyField="id"
                  data={empleados}
                  columns={columns}
                  selectRow={selectRow}
                  pagination={paginationFactory(options)}
                />
              </FormGroup>
            </Container>
          </Col>
        </div>
      );
    } else {
      tableEmpleado = "";
    }    

    const modalSave = (
      <Modal
        isOpen={this.state.modalSave}
        toggle={this.toggleSave}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggleSave}>
          Confirmar guardar ubicacion
        </ModalHeader>
        <ModalBody>
          Esta seguro de guardar la ubicacion
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.save}>
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={this.toggleSave}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    );

    return (
      <div>
        {modalSave}
        <AppNavbar />
        <Container className="App">
          <h2>Configuracion Ubicacion</h2>
          <Form className="form">
            <Col>
              <FormGroup>
                <Label for="ubicaciones">Lugar de Trabajo</Label>
                <Input
                  ref="ubicaciones"
                  type="select"                  
                  value={this.state.fields.idUbicacion}
                  onChange={(e) => {
                    this.handleUbicacionChange(e.target.value);
                  }}
                >
                  {optionUbicacion}
                </Input>
              </FormGroup>
            </Col>
            {ingenieroOficialInput}
            {tableEmpleado}
            <Col>
              <FormGroup>
                <Button color="primary" onClick={this.toggleSave}>
                  Guardar
                </Button>
                {"    "}
                <Button color="primary" onClick={this.agregarEmpleados}>
                  Agregar Empleados
                </Button>
                {"    "}
                <Button color="primary" onClick={this.quitarEmpleados}>
                  Quitar Empleados
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

export default ConfiguraUbicacion;
