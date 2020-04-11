import React, { Component } from 'react';
import { Container, Col, Form, FormGroup, Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Label, Row, Input} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import AppNavbar from 'menu/AppNavbar';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Constant from 'common/Constant';
import axios from 'axios';

const PATH_EMPLEADO_SERVICE = Constant.EMPLEADO_API+Constant.EMPLEADO_SERVICE;
const PATH_EMPLEADOS_SEARCH_SERVICE = Constant.EMPLEADO_API+Constant.EMPLEADOS_SEARCH_SERVICE;
const options = Constant.OPTIONS_TABLE;

let rowId = '';

class EmpleadosList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fields: {id:'', nombres:'', apellidos:''},
      empleados: [],
      isLoading: false,
      error: null,
      isExistData: false,
      formState: '',
      modal: false
    };
  }

  searchSubmit = async () =>{
    this.setState({isLoading: true});
    const fields = this.state.fields;    

    if(!fields.id && !fields.nombres && !fields.apellidos){
      this.setState({isExistData: false, formState: 'errorSearch', isLoading: false});
    }else{
      await axios.get(PATH_EMPLEADOS_SEARCH_SERVICE, {
        params: {
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

  handleChange = (value, field) =>{
    let {fields} = this.state;
    fields[field] = value;
    this.setState(fields);
  }

  onRowSelect(row, isSelected, e) {
    rowId = row['id'];
  }

  edit = (id) => {
    let path = `empleado/${id}`;
    this.props.history.push(path);
  }

  create = (path) =>{
    this.props.history.push(path);
  }

  remove = async (id) =>{
    await axios({
      method: 'DELETE',
      url: PATH_EMPLEADO_SERVICE+`/${id}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedEmpleados = [...this.state.empleados].filter(i => i.id !== id);
      let isExistData = true;

      if(updatedEmpleados.length == 0){
        isExistData = false;
      }

      this.setState({empleados: updatedEmpleados, formState: 'success', modal:false, isExistData: isExistData});
    }).catch(error => this.setState({
        error,
        isLoading: false,
        formState: 'error'
      }));
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const { empleados, isLoading, error, isExistData, formState} = this.state;

    let messageError;
    if (formState == 'error') {
      messageError = <Alert color="danger">{error.response.data.message}</Alert>;
    }else if(formState == 'success'){
      messageError = <Alert color="success">El empleado se elimino satisfactoriamente</Alert>;
    }else if(formState == 'errorSearch'){
      messageError = <Alert color="danger">Debe ingresar el id, nombres o apellidos para poder buscar</Alert>;
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
      mode: 'radio',
      selected: [isExistData?rowId:0],
      clickToSelect: true,
      bgColor: "rgb(89, 195, 245)",
      onSelect: this.onRowSelect
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
                    <ModalHeader toggle={this.toggle}>Confirmar Eliminar</ModalHeader>
                      <ModalBody>
                        Esta seguro de eliminar el empleado
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={() => this.remove(rowId)}>Eliminar</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                      </ModalFooter>
                    </Modal>;

    return (
      <div>
        {modal }
        <AppNavbar/>
        <Container className="App">
          <h2>Empleados</h2>
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
                      value={this.state.fields.id}
                      onChange={e => {
                        this.handleChange(e.target.value, "id");
                      }}
                      />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="nombres">Nombre</Label>
                    <Input ref="nombres"
                      type="text"
                      size="30"
                      placeholder="Nombres del empleado"                      
                      value={this.state.fields.nombres}
                      onChange={e => {
                        this.handleChange(e.target.value, "nombres");
                      }}
                      />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="apellidos">Apellidos</Label>
                    <Input ref="apellidos"
                      type="text"
                      size="30"
                      placeholder="Apellidos del empleado"                      
                      value={this.state.fields.apellidos}
                      onChange={e => {
                        this.handleChange(e.target.value, "apellidos");
                      }}
                      />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            {tableEmpleado }
            <Col>
              <FormGroup>
                <Button color="primary" type="submit" id="submit">Consultar</Button>{'    '}
                <Button color="primary" onClick={(path) => this.create("empleado/new")}>Crear</Button>{'    '}
                <Button color="primary" disabled={!this.state.isExistData} onClick={(id) => this.edit(rowId)} >Modificar</Button>{'    '}
                <Button color="primary" disabled={!this.state.isExistData} onClick={this.toggle}>Eliminar</Button>
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

export default EmpleadosList;
