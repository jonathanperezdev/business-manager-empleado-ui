import React, { Component } from 'react';
import { Container, Col, Form, Button, Alert, Modal} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import AppNavbar from 'menu/AppNavbar';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Constant from 'common/Constant';
import axios from 'axios';
import Loading from 'common/Loading';
const options = Constant.OPTIONS_TABLE;

const PATH_UBICACIONES_SERVICE = Constant.EMPLEADO_API+'/ubicaciones';
const PATH_UBICACION_SERVICE = Constant.EMPLEADO_API+'/ubicacion';

let rowId = '';

class UbicacionesList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ubicaciones: [],
      isLoading: true,
      error: null,
      isExistData: false,
      deletedState: '',
      modal: false
    };    
  }

  componentDidMount() {
    this.setState({isLoading: true});

    axios.get(PATH_UBICACIONES_SERVICE)
      .then(result => {
        if(result.data.length == 0){
          this.setState({isLoading: false, isExistData: false});
        }else{
          rowId = result.data[0].id;
          this.setState({ubicaciones: result.data, isLoading: false, isExistData: true});
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
    let path = `ubicacion/${id}`;
    this.props.history.push(path);
  }

  create = (path) =>{
    this.props.history.push(path);
  }

  remove = async (id) => {
    await axios({
      method: 'DELETE',
      url: PATH_UBICACION_SERVICE+`/${id}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedUbicaciones = [...this.state.ubicaciones].filter(i => i.id !== id);
      let isExistData = true;

      if(updatedUbicaciones.length == 0){
        isExistData = false;
      }

      this.setState({ubicaciones: updatedUbicaciones, deletedState: 'success', modal:false, isExistData: isExistData});
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
    const { ubicaciones, error, isExistData, deletedState, formState, isLoading } = this.state;    

    if (isLoading) {
      return  <Loading/> 
    }
    
    let messageLabel;
    if (deletedState == 'error') {
      messageLabel = <Alert variant="danger">{error.response.data.message}</Alert>;
    }else if(deletedState == 'success'){
      messageLabel = <Alert variant="success">La ubicacion se elimino satisfactoriamente</Alert>;
    }

    const columns = [{
      dataField: 'id',
      text: 'Codigo',
      isKey: 'true'
    }, {
      dataField: 'nombre',
      text: 'Nombre'
    }, {
      dataField: 'direccion',
      text: 'Direccion'
    }, {
      dataField: 'tipo',
      text: 'Tipo'
    }, {
      dataField: 'descripcion',
      text: 'Descripcion'
    }];

    const selectRow = {
      mode: 'radio',
      selected: [isExistData?rowId:0],
      clickToSelect: true,
      bgColor: "rgb(89, 195, 245)",
      onSelect: this.onRowSelect
    };

    const modal = <Modal show={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <Modal.Header toggle={this.toggle}>Confirmar Eliminar</Modal.Header>
                      <Modal.Body>
                        Esta seguro de eliminar la ubicacion
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="outline-primary" onClick={() => this.remove(rowId)}>Eliminar</Button>{' '}
                        <Button variant="outline-secondary" onClick={this.toggle}>Cancelar</Button>
                      </Modal.Footer>
                    </Modal>;

    return (
      <div>
        {modal }
        <AppNavbar/>
        <Container className="App">
          <h2>Ubicaciones</h2>
          <Form className="form">
            <Col>
              <Form.Group>
                <BootstrapTable
                  keyField='id'
                  data={ ubicaciones }
                  columns={ columns }
                  selectRow={ selectRow }
                  pagination={ paginationFactory(options)}/>
              </Form.Group>
            </Col>
            <Col>
            <Form.Group>
              <Button variant="outline-primary" disabled={!this.state.isExistData} onClick={(id) => this.edit(rowId)} >Modificar</Button>{'    '}
              <Button variant="outline-secondary" disabled={!this.state.isExistData} onClick={this.toggle}>Eliminar</Button>{'    '}
              <Button variant="outline-secondary" onClick={(path) => this.create("ubicacion/new")}>Crear</Button>
            </Form.Group>
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

export default UbicacionesList;
