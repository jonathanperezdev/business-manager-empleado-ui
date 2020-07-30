import React, { Component } from 'react';
import {withRouter } from 'react-router-dom';
import { Container, Col, Form, Button, Alert, Row} from 'react-bootstrap';
import AppNavbar from 'menu/AppNavbar';
import Constant from 'common/Constant';
import axios from 'axios';
import {validateRequired} from 'common/Validator';
import UbicacionDesc from 'common/UbicacionDesc';
import Loading from 'common/Loading';

import 'css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PATH_EMPLEADO_SERVICE = Constant.EMPLEADO_API+'/empleado';
const PATH_CARGOS_SERVICE = Constant.EMPLEADO_API+'/cargos';
const PATH_TIPO_DOCUMENTOS_SERVICE = Constant.EMPLEADO_API+'/tipoDocumentos';
const PATH_UBICACION_SERVICE = Constant.EMPLEADO_API + '/ubicacion';

class EmpleadoEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fields: {},
      errors: {},
      formState: '',
      cargos:[],
      tipoDocumentos:[],
      firstCargo:'',
      firstTipoDocumento:'',
      ubicacion: {}
    }

    this.resetForm();
  }

  async componentDidMount() {
    if (this.props.match.params.id != 'new') {
      
      let idUbicacion;
      await axios.get(PATH_EMPLEADO_SERVICE+`/${this.props.match.params.id}`)
      .then(result => {
        idUbicacion = result.data.ubicacion;
        this.setState({fields: result.data, formState: 'success', isLoading: false})})
      .catch(error => this.setState({ error, formState: "error", isLoading: false}));
      
      await axios.get(PATH_UBICACION_SERVICE+`/${idUbicacion}`)
      .then(result => this.setState({ubicacion: result.data, formState: 'success', isLoading: false}))
      .catch(error => this.setState({ error, formState: "error", isLoading: false}));
    }

    await axios.get(PATH_CARGOS_SERVICE)
    .then(result => {
      let {fields} = this.state;
      fields.cargo = result.data[0].id;
        
      let firstCargo = result.data[0].id;
      this.setState({cargos: result.data, fields: fields, firstCargo: firstCargo, formState: 'success', isLoading: false});
    }).catch(error => this.setState({
      error, formState: "error", isLoading: false
    }));

    await axios.get(PATH_TIPO_DOCUMENTOS_SERVICE)
      .then(result => {
        let {fields} = this.state;
        fields.tipoDocumento = result.data[0].id;
        
        let firstTipoDocumento = result.data[0].id;
        this.setState({tipoDocumentos: result.data, fields: fields, firstTipoDocumento: firstTipoDocumento, formState: 'success', isLoading: false});
      }).catch(error => this.setState({
        error, formState: "error", isLoading: false})
    );
  }

  resetForm = () =>{
    let {fields, firstTipoDocumento, firstCargo} = this.state;
    
    fields.tipoDocumento = firstTipoDocumento;
    fields.numeroDocumento = '';
    fields.cargo = firstCargo;
    fields.nombres = '';
    fields.apellidos = '';
    fields.salario = '';
    fields.direccion = '';
    fields.numeroCelular = '';
    fields.telefono = '';
    fields.contactoEmergenciaNombres = '';
    fields.contactoEmergenciaApellidos = '';
    fields.contactoEmergenciaTelefono = '';    

    this.setState({fields: fields, formState: 'new'});
  }

  handleValidation(){
    let {fields} = this.state;

    let errors = {
      nombres: validateRequired(fields.nombres, "nombres"),
      apellidos: validateRequired(fields.apellidos, "apellidos"),
      salario: validateRequired(fields.salario, "salario"),
      direccion: validateRequired(fields.direccion, "direccion"),
      numeroDocumento: validateRequired(fields.numeroDocumento, "numero de documento")
    };

    let formState = '';
    if(errors.nombres || errors.apellidos || errors.salario || errors.direccion || errors.numeroDocumento){
      formState = 'invalid';
    }    
    this.setState({errors: errors, formState: formState, isLoading: false});

    return formState ==! 'invalid';
  }

  save = async () =>{
    this.setState({isLoading: true});

    const {fields} = this.state;
    const id = fields.id;

    if(this.handleValidation()){      
      await axios({
        method: (id) ? 'PUT' : 'POST',
        url: (id) ? PATH_EMPLEADO_SERVICE+'/'+(id) : PATH_EMPLEADO_SERVICE,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(fields) })
        .then(result => {this.setState({ isLoading: false, formState: 'saved', isLoading: false })})
        .catch(error => this.setState({error, formState: "error", isLoading: false}));
    }
  }

  handleChange = (valor, field) => {
    let {fields} = this.state;
    fields[field] = valor;
    this.setState(fields);    
  };

  render = () => {
    const {fields, formState, errors, error, cargos, tipoDocumentos, firstCargo, firstTipoDocumento, isLoading, ubicacion} = this.state;
    
    if (isLoading) {
      return  <Loading/> 
    }

    let messageLabel;
    if (formState == 'error') {
      messageLabel = <Alert variant="danger">{error.response.data.message}</Alert>;
    } else if(formState == 'invalid'){
      messageLabel = <Alert variant="danger">El fomulario tiene errores</Alert>;
    }else if (formState == 'saved') {
      messageLabel = <Alert variant="success">El empleado fue guardado satisfactoriamente</Alert>;
    } 

    let messageNombres;
    if(errors.nombres){
      messageNombres = <Alert variant="danger">{this.state.errors.nombres}</Alert>;
    }

    let messageApellidos;
    if(errors.apellidos){
      messageApellidos = <Alert variant="danger">{this.state.errors.apellidos}</Alert>;
    }

    let messageSalario;
    if(errors.salario){
      messageSalario = <Alert variant="danger">{this.state.errors.salario}</Alert>;
    }

    let messageDireccion;
    if(errors.direccion){
      messageDireccion = <Alert variant="danger">{this.state.errors.direccion}</Alert>;
    }

    let messageNumeroDocumento;
    if(errors.numeroDocumento){
      messageNumeroDocumento = <Alert variant="danger">{this.state.errors.numeroDocumento}</Alert>;
    }

    let optionCargos = cargos.map((cargo) =>
      <option key={cargo.id}
        value={cargo.id}
        default={(fields.id)?fields.cargo:firstCargo} >{cargo.nombre}</option>
    );

    let optionTipoDocumentos = tipoDocumentos.map((tipoDocumento) =>     
      <option key={tipoDocumento.id}
        value={tipoDocumento.id}
        default={(fields.id)?fields.tipoDocumento:firstTipoDocumento} >{tipoDocumento.nombre}</option>
    );

    let UbicacionComponent;
    if(ubicacion){
      UbicacionComponent =
      <UbicacionDesc
        ubicacion ={ubicacion}
        />;
    }

    const id = fields["id"];
    const title = <h2>{id ? 'Modificar Empleado' : 'Agregar Empleado'}</h2>;  
    
    return (
      <div>
        <AppNavbar />
        <Container className="App">
          {title}
          <Form className="form">
            <Col>
              <Row>
              <Col sm="2">
                  <Form.Group>
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control                      
                      as="select"
                      value={this.state.fields.cargo}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "cargo");
                      }}
                    >
                      {optionCargos}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="cargo.tipoDocumento">
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
                      type="number"
                      size="15"
                      placeholder="Numero de documento"
                      value={this.state.fields.numeroDocumento}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "numeroDocumento");
                      }}
                    />
                    {messageNumeroDocumento}
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>                
                <Col>
                  <Form.Group controlId="empleado.nombres">
                    <Form.Label>Nombres</Form.Label>
                    <Form.Control
                      size="30"
                      placeholder="Nombres del empleado"
                      value={this.state.fields.nombres}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "nombres");
                      }}
                    />
                    {messageNombres}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="empleado.apellidos">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      size="30"
                      placeholder="Apellidos del empleado"
                      value={this.state.fields.apellidos}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "apellidos");
                      }}
                    />
                    {messageApellidos}
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col sm="2">
                  <Form.Group controlId="empleado.salario">
                    <Form.Label>Salario</Form.Label>
                    <Form.Control                                            
                      type="number"
                      size="8"
                      placeholder="Salario del empleado"
                      value={this.state.fields.salario}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "salario");
                      }}
                    />
                    {messageSalario}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="empleado.direccion">
                    <Form.Label>Direccion</Form.Label>
                    <Form.Control
                      size="70"
                      placeholder="Direccion del empleado"
                      value={this.state.fields.direccion}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "direccion");
                      }}
                    />
                    {messageDireccion}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="empleado.numeroCelular">
                    <Form.Label>Numero Celular</Form.Label>
                    <Form.Control                                           
                      type="number"
                      size="13"
                      placeholder="Celular"
                      value={this.state.fields.numeroCelular}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "numeroCelular");
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>

            <Col sm="2">
              <Form.Group controlId="empleado.telefono">
                <Form.Label>Telefono</Form.Label>
                <Form.Control                  
                  type="number"
                  size="13"
                  placeholder="Telefono"
                  value={this.state.fields.telefono}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "telefono");
                  }}
                />
              </Form.Group>
            </Col>

            <Col>
              <Container className="App">
                <h5>Contacto de Emergencia</h5>
                <Row>
                  <Col>
                    <Form.Group controlId="empleado.contactoEmergenciaNombres">
                      <Form.Label>Nombres</Form.Label>
                      <Form.Control
                        size="30"
                        placeholder="Nombres"
                        value={this.state.fields.contactoEmergenciaNombres}
                        onChange={(e) => {
                          this.handleChange(
                            e.target.value,
                            "contactoEmergenciaNombres"
                          );
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="empleado.contactoEmergenciaApellidos">
                      <Form.Label>Apellidos</Form.Label>
                      <Form.Control
                        size="30"
                        placeholder="Apellidos"
                        value={this.state.fields.contactoEmergenciaApellidos}
                        onChange={(e) => {
                          this.handleChange(
                            e.target.value,
                            "contactoEmergenciaApellidos"
                          );
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="3">
                    <Form.Group controlId="empleado.contactoEmergenciaTelefono">
                      <Form.Label>Telefono</Form.Label>
                      <Form.Control                        
                        type="number"
                        size="13"
                        placeholder="Numero celular o telefonico"
                        value={this.state.fields.contactoEmergenciaTelefono}
                        onChange={(e) => {
                          this.handleChange(
                            e.target.value,
                            "contactoEmergenciaTelefono"
                          );
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            </Col>
            {UbicacionComponent}            
            <Form.Group>
              <Button disabled={formState=='saved'} variant="outline-primary" onClick={this.save}>
                Guardar
              </Button>{" "}
              <Button variant="outline-secondary" href="/empleados">
                Regresar
              </Button>{" "}
              <Button variant="outline-secondary" onClick={this.resetForm}>
                Nuevo
              </Button>
            </Form.Group>
            <Col>
             {messageLabel}
            </Col>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(EmpleadoEdit);
