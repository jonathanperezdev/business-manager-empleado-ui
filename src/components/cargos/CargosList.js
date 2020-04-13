import React, { Component } from 'react';
import { Container, Col, Form, FormGroup, Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import AppNavbar from 'menu/AppNavbar';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Constant from 'common/Constant';
import axios from 'axios';
const options = Constant.OPTIONS_TABLE;

const PATH_CARGOS_SERVICE = Constant.EMPLEADO_API+Constant.CARGOS_SERVICE;
const PATH_CARGO_SERVICE = Constant.EMPLEADO_API+Constant.CARGO_SERVICE;

let rowId = '';

class CargosList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cargos: [],
      isLoading: true,
      error: null,
      isExistData: true,
      deletedState: '',
      modal: false
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});

    axios.get(PATH_CARGOS_SERVICE)
      .then(result => {
        if(result.data.length == 0){
          this.setState({isLoading: false, isExistData: false});
        }else{
          rowId = result.data[0].id;
          this.setState({cargos: result.data, isLoading: false, isExistData: true});
        }
      })
      .catch(error => this.setState({
        error,
        isLoading: false
      }));
  }

  onRowSelect(row, isSelected, e) {
    rowId = row['id'];
  }

  edit = (id) =>{
    let path = `cargo/${id}`;
    this.props.history.push(path);
  }

  create = (path) =>{
    this.props.history.push(path);
  }

  remove = async (id) => {
    await axios({
      method: 'DELETE',
      url: PATH_CARGO_SERVICE+`/${id}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedCargos = [...this.state.cargos].filter(i => i.id !== id);
      let isExistData = true;

      if(updatedCargos.length == 0){
        isExistData = false;
      }

      this.setState({cargos: updatedCargos, deletedState: 'success', modal:false, isExistData: isExistData});
    }).catch(error => this.setState({
        error, isLoading: false, deletedState: 'error', modal:false
      }));
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const { cargos, error, isExistData, deletedState, formState, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    let messageLabel;
    if (deletedState == 'error') {
      messageLabel = <Alert color="danger">{error.response.data.message}</Alert>;
    }else if(deletedState == 'success'){
      messageLabel = <Alert color="success">El cargo se elimino satisfactoriamente</Alert>;
    } else if (formState == "error") {
      messageLabel = (
        <Alert color="danger">{error.response.data.message}</Alert>
      );
    }

    const columns = [{
      dataField: 'id',
      text: 'Codigo',
      isKey: 'true'
    }, {
      dataField: 'nombre',
      text: 'Nombre'
    }, {
      dataField: 'descripcion',
      text: 'Descripcion'
    }, {
      dataField: 'funciones',
      text: 'Funciones'
    }];

    const selectRow = {
      mode: 'radio',
      selected: [isExistData?rowId:0],
      clickToSelect: true,
      bgColor: "rgb(89, 195, 245)",
      onSelect: this.onRowSelect
    };

    const modal = <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Confirmar Eliminar</ModalHeader>
                      <ModalBody>
                        Esta seguro de eliminar el cargo
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
          <h2>Cargos</h2>
          <Form className="form">
            <Col>
              <FormGroup>
                <BootstrapTable
                  keyField='id'
                  data={ cargos }
                  columns={ columns }
                  selectRow={ selectRow }
                  pagination={ paginationFactory(options)} />
              </FormGroup>
            </Col>
            <Col>
            <FormGroup>
              <Button color="primary" disabled={!this.state.isExistData} onClick={() => this.edit(rowId)} >Modificar</Button>{'    '}
              <Button color="primary" disabled={!this.state.isExistData} onClick={this.toggle}>Eliminar</Button>{'    '}
              <Button color="primary" onClick={() => this.create("cargo/new")}>Crear Cargo</Button>
            </FormGroup>
            </Col>
            <Col>
             {messageLabel }
            </Col>
          </Form >
        </Container>
      </div>
    );
  }
}

export default CargosList;
