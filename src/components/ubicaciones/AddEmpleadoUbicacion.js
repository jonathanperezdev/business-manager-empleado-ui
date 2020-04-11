import React, { Component } from 'react';
import {withRouter } from 'react-router-dom';
import { Container, Col, Form, FormGroup, Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Label, Row, Input} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import AppNavbar from 'menu/AppNavbar';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Constant from 'common/Constant';
import axios from 'axios';

const PATH_EMPLEADOS_SEARCH_SERVICE = Constant.EMPLEADO_API+Constant.EMPLEADOS_TIPO_UBICACION_SEARCH;
const PATH_UBICACION_SERVICE = Constant.EMPLEADO_API+Constant.UBICACION_SERVICE;
const PATH_EMPLEADO_UBICACION_SERVICE = Constant.EMPLEADO_API+Constant.EMPLEADOS_UBICACION_SERVICE;
const options = Constant.OPTIONS_TABLE;

let rowId = '';

class AddEmpleadoUbicacion extends Component {

  emptyState = {
    id: '',
    nombres: '',
    apellidos: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      fields: this.emptyState,
      ubicacion: {},
      request: {},
      empleados: [],
      selected: [],
      isLoading: false,
      error: null,
      isExistData: false,
      formState: '',
      modal: false
    };

    this.searchSubmit = this.searchSubmit.bind(this);
    this.addEmpleadoUbicacion = this.addEmpleadoUbicacion.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.toggle = this.toggle.bind(this);
    this.openModal = this.openModal.bind(this);
    this.cancelar = this.cancelar.bind(this);
  }

  async componentDidMount() {
    this.setState({isLoading: true});

    axios.get(PATH_UBICACION_SERVICE+`/${this.props.match.params.idUbicacion}`)
      .then(result => {
        let {request} = this.state;
        request.idUbicacion = this.props.match.params.idUbicacion;
        this.setState({ubicacion: result.data, request: request, isLoading: false});
      }).catch(error => this.setState({
        error,
        isLoading: false
    }));
  }

  async addEmpleadoUbicacion(){
    let {request, selected} = this.state;
    request.idEmpleados = selected;

    await axios({
      method: 'PUT',
      url: PATH_EMPLEADO_UBICACION_SERVICE,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(request)
      }).catch(error => this.setState({
        error,
        isLoading: false,
        formState: 'error'
      }));

      this.props.history.push(`/configuraUbicacion/${this.props.match.params.idUbicacion}`);
  }

  async searchSubmit(e){
    this.setState({isLoading: true});
    const {fields, ubicacion} = this.state;

    e.preventDefault();

    if(!fields.id && !fields.nombres && !fields.apellidos){
      this.setState({isExistData: false, formState: 'errorSearch', isLoading: false});
    }else{
      await axios.get(PATH_EMPLEADOS_SEARCH_SERVICE, {
        params: {
          tipoUbicacion: ubicacion.tipo,
          id: fields.id,
          nombres: fields.nombres,
          apellidos: fields.apellidos
        }
      }).then(result => {
        rowId = result.data[0].id;
        this.setState({isLoading: false, empleados: result.data, isExistData: true, error: null});
      }).catch(error => this.setState({
        error,
        isLoading: false,
        isExistData: false,
        formState: 'error'
      }));
    }
  }

  handleChange(field, e){
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({fields});
  }

  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id)
      }));
    }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  openModal() {
    const {selected} = this.state;
    let modal, formState;

    if(selected.length == 0){
      modal = false;
      formState = 'selectedEmpty';
    }else{
      modal = true;
      formState = 'OK';
    }
    this.setState({
      modal: modal,
      formState: formState
    });
  }

  cancelar(){
    this.props.history.push(`/configuraUbicacion/${this.props.match.params.idUbicacion}`);
  }

  render() {
    const { empleados, isLoading, error, isExistData, formState, ubicacion} = this.state;

    let messageError;
    if (formState == 'error') {
      messageError = <Alert color="danger">{error.response.data.message}</Alert>;
    }else if(formState == 'errorSearch'){
      messageError = <Alert color="danger">Debe ingresar el id, nombres o apellidos para poder buscar</Alert>;
    }else if (formState == 'selectedEmpty') {
      messageError = <Alert color="danger">Debe seleccionar minimo un empleado</Alert>;
    }

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const columns = [{
      dataField: 'id',
      text: 'Codigo',
      isKey: 'true'
    }, {
      dataField: 'nombres',
      text: 'Nombres'
    }, {
      dataField: 'apellidos',
      text: 'Apellidos'
    }];

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: this.handleOnSelect,
      bgColor: "rgb(89, 195, 245)"
    };

    let tableEmpleado;

    if(isExistData){
      tableEmpleado =
        <div>
        <Col>
          <FormGroup>
            <BootstrapTable
              keyField='id'
              data={ empleados }
              columns={ columns }
              selectRow={ selectRow }
              pagination={ paginationFactory(options) }
              />
          </FormGroup>
        </Col>
        </div>;
    }else{
      tableEmpleado = '';
    }

    const modal = <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Confirmar Agregar Empleados</ModalHeader>
                      <ModalBody>
                        Esta seguro de agregar empleados a la ubicacion {ubicacion.nombre}
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={this.addEmpleadoUbicacion}>Agregar</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                      </ModalFooter>
                    </Modal>;

    return (
      <div>
        {modal }
        <AppNavbar/>
        <Container className="App">
          <h2>Agregar Empleados a {ubicacion.nombre}</h2>
          <Form className="form" onSubmit= {this.searchSubmit.bind(this)} >
            <Col>
              <Row form>
                <Col sm={1}>
                  <FormGroup>
                    <Label for="id">Codigo</Label>
                    <Input ref="id"
                      pattern="[0-9]*"
                      title="Porfavor ingrese un numero valido"
                      type="text"
                      size="4"
                      placeholder="Codigo del empleado"
                      onChange={this.handleChange.bind(this, "id")}
                      value={this.state.fields["id"]}/>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="nombres">Nombre</Label>
                    <Input ref="nombres"
                      type="text"
                      size="30"
                      placeholder="Nombres del empleado"
                      onChange={this.handleChange.bind(this, "nombres")}
                      value={this.state.fields["nombres"]}/>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="apellidos">Apellidos</Label>
                    <Input ref="apellidos"
                      type="text"
                      size="30"
                      placeholder="Apellidos del empleado"
                      onChange={this.handleChange.bind(this, "apellidos")}
                      value={this.state.fields["apellidos"]}/>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            {tableEmpleado }
            <Col>
              <FormGroup>
                <Button color="primary" type="submit" id="submit">Consultar</Button>{'    '}
                <Button color="primary" disabled={!this.state.isExistData} onClick={this.openModal} >Agregar Empleados</Button>{'    '}
                <Button color="primary" onClick={this.cancelar}>Cancelar</Button>
            </FormGroup>
            </Col>
            <Col>
             {messageError }
            </Col>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(AddEmpleadoUbicacion);
