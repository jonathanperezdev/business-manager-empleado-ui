import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Col, Form, FormGroup, Label, Button, Input, Alert, Row} from 'reactstrap';
import AppNavbar from 'menu/AppNavbar';
import 'css/App.css';
import Constant from 'common/Constant';
import axios from 'axios';
import {validateRequired} from 'common/Validator';
import UbicacionDesc from 'common/UbicacionDesc';


const PATH_EMPLEADO_SERVICE = Constant.EMPLEADO_API+Constant.EMPLEADO_SERVICE;
const PATH_CARGOS_SERVICE = Constant.EMPLEADO_API+Constant.CARGOS_SERVICE;
const PATH_TIPO_DOCUMENTOS_SERVICE = Constant.EMPLEADO_API+Constant.TIPO_DOCUMENTOS_SERVICE;

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
      firstTipoDocumento:''
    }

    this.resetForm();
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      axios.get(PATH_EMPLEADO_SERVICE+`/${this.props.match.params.id}`)
      .then(result => this.setState({fields: result.data, formState: 'success', isLoading: false}))
      .catch(error => this.setState({ error, formState: "error", isLoading: false}));    
    }

    axios.get(PATH_CARGOS_SERVICE)
    .then(result => {
      let {fields} = this.state;
      fields.cargo = result.data[0].id;
        
      let firstCargo = result.data[0].id;
      this.setState({cargos: result.data, fields: fields, firstCargo: firstCargo, formState: 'success', isLoading: false});
    }).catch(error => this.setState({
      error, formState: "error", isLoading: false
    }));

    axios.get(PATH_TIPO_DOCUMENTOS_SERVICE)
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
    let {fields} = this.state;

    fields.tipoDocumento = (fields.id) ? this.state.firstTipoDocumento : '';
    fields.numeroDocumento = '';
    fields.cargo = (fields.id) ? this.state.firstCargo : '';
    fields.nombres = '';
    fields.apellidos = '';
    fields.salario = '';
    fields.direccion = '';
    fields.numeroCelular = '';
    fields.telefono = '';
    fields.contactoEmergenciaNombres = '';
    fields.contactoEmergenciaApellidos = '';
    fields.contactoEmergenciaTelefono = '';    

    this.setState(fields);
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
    this.setState({errors: errors, formState: formState});

    return formState ==! 'invalid';
  }

  save = async () =>{
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
    const {fields, formState, errors, error, cargos, tipoDocumentos, firstCargo, firstTipoDocumento, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    let messageLabel;
    if (formState == 'error') {
      messageLabel = <Alert color="danger">{error.response.data.message}</Alert>;
    } else if(formState == 'invalid'){
      messageLabel = <Alert color="danger">El fomulario tiene errores</Alert>;
    }else if (formState == 'saved') {
      messageLabel = <Alert color="success">El empleado fue guardado satisfactoriamente</Alert>;
    } 

    let messageNombres;
    if(errors.nombres){
      messageNombres = <Alert color="danger">{this.state.errors.nombres}</Alert>;
    }

    let messageApellidos;
    if(errors.apellidos){
      messageApellidos = <Alert color="danger">{this.state.errors.apellidos}</Alert>;
    }

    let messageSalario;
    if(errors.salario){
      messageSalario = <Alert color="danger">{this.state.errors.salario}</Alert>;
    }

    let messageDireccion;
    if(errors.direccion){
      messageDireccion = <Alert color="danger">{this.state.errors.direccion}</Alert>;
    }

    let messageNumeroDocumento;
    if(errors.numeroDocumento){
      messageNumeroDocumento = <Alert color="danger">{this.state.errors.numeroDocumento}</Alert>;
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

    let ubicacion;
    if(this.state.fields.ubicacion){
      ubicacion =
      <UbicacionDesc
        ubicacion ={this.state.fields.ubicacion}
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
              <Row form>
              <Col sm="2">
                  <FormGroup>
                    <Label for="cargo">Cargo</Label>
                    <Input
                      ref="cargo"
                      type="select"
                      value={this.state.fields.cargo}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "cargo");
                      }}
                    >
                      {optionCargos}
                    </Input>
                  </FormGroup>
                </Col>
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
                    {messageNumeroDocumento}
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row form>                
                <Col>
                  <FormGroup>
                    <Label for="nombres">Nombres</Label>
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
                    {messageNombres}
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
                    {messageApellidos}
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row form>
                <Col sm="2">
                  <FormGroup>
                    <Label for="salario">Salario</Label>
                    <Input
                      ref="salario"
                      pattern="[0-9]*"
                      title="Porfavor ingrese un numero valido"
                      type="text"
                      size="8"
                      placeholder="Salario del empleado"
                      value={this.state.fields.salario}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "salario");
                      }}
                    />
                    {messageSalario}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="direccion">Direccion</Label>
                    <Input
                      ref="direccion"
                      type="text"
                      size="70"
                      placeholder="Direccion del empleado"
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
                    <Label for="numeroCelular">Numero Celular</Label>
                    <Input
                      ref="numeroCelular"
                      pattern="[0-9]*"
                      title="Porfavor ingrese un numero valido"
                      type="text"
                      size="13"
                      placeholder="Celular"
                      value={this.state.fields.numeroCelular}
                      onChange={(e) => {
                        this.handleChange(e.target.value, "numeroCelular");
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>

            <Col sm="2">
              <FormGroup>
                <Label for="telefono">Telefono</Label>
                <Input
                  ref="telefono"
                  type="text"
                  size="13"
                  placeholder="Telefono"
                  value={this.state.fields.telefono}
                  onChange={(e) => {
                    this.handleChange(e.target.value, "telefono");
                  }}
                />
              </FormGroup>
            </Col>

            <Col>
              <Container className="App">
                <h5>Contacto de Emergencia</h5>
                <Row form>
                  <Col>
                    <FormGroup>
                      <Label for="contactoEmergenciaNombres">Nombres</Label>
                      <Input
                        ref="contactoEmergenciaNombres"
                        type="text"
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
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="contactoEmergenciaApellidos">Apellidos</Label>
                      <Input
                        ref="contactoEmergenciaApellidos"
                        type="text"
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
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <Label for="contactoEmergenciaTelefono">Telefono</Label>
                      <Input
                        ref="contactoEmergenciaTelefono"
                        type="text"
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
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </Col>
            {ubicacion}            
            <FormGroup>
              <Button color="primary" onClick={this.save}>
                Guardar
              </Button>{" "}
              <Button color="secondary" tag={Link} to="/empleados">
                Regresar
              </Button>{" "}
              <Button color="secondary" onClick={this.resetForm}>
                Nuevo
              </Button>
            </FormGroup>
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
