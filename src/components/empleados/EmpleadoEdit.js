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

class EmpleadoEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      formState: '',
      cargos:[],
      firstCargo:''
    }
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      axios.get(PATH_EMPLEADO_SERVICE+`/${this.props.match.params.id}`)
        .then(result =>
            this.setState({fields: result.data}))
        .catch(error => this.setState({
          error,
          isLoading: false
        }));
    }

    axios.get(PATH_CARGOS_SERVICE)
      .then(result => {
        let fields = this.state.fields;
        fields.cargo = result.data[0].id;
        this.setState({cargos: result.data, fields: fields});
      }).catch(error => this.setState({
        error
      })
    );
  }

  resetForm = () =>{
    let fields = this.state.fields;

    fields.nombres = '';
    fields.apellidos = '';
    fields.salario = '';
    fields.direccion = '';
    fields.numeroCelular = '';
    fields.telefono = '';
    fields.contactoEmergenciaNombres = '';
    fields.contactoEmergenciaApellidos = '';
    fields.contactoEmergenciaTelefono = '';
    fields.cargo = this.state.firstCargo;

    this.setState({fields: fields});
  }

  handleValidation(){
    let fields = this.state.fields;
    let errors = {
      nombres: validateRequired(fields.nombres, "nombres"),
      apellidos: validateRequired(fields.apellidos, "apellidos"),
      salario: validateRequired(fields.salario, "salario"),
      direccion: validateRequired(fields.direccion, "direccion")
    };
    let formState = '';

    if(errors.nombres || errors.apellidos || errors.salario || errors.direccion){
      formState = 'invalid';
    }
    this.setState({errors: errors, formState: formState});

    return formState ==! 'invalid';
  }

  contactSubmit = async (e) =>{
    const fields = this.state.fields;
    const id = fields["id"];

    e.preventDefault();

    if(this.handleValidation()){

      await axios({
        method: (id) ? 'PUT' : 'POST',
        url: (id) ? PATH_EMPLEADO_SERVICE+'/'+(id) : PATH_EMPLEADO_SERVICE,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(fields)
      });
      this.setState({formState: 'saved'});
    }
  }

  handleChange = (valor, field) => {
    let {fields} = this.state;
    fields[field] = valor;
    this.setState(fields);    
  };

  render = () => {
    const {fields, formState, errors, cargos, firstCargo} = this.state;

    let optionCargos = cargos.map((cargo) =>
      <option key={cargo.id}
        value={cargo.id}
        default={(fields.id)?fields.cargo:firstCargo} >{cargo.nombre}</option>
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
    let messageLabel;
    let messageCelular;

    if(formState == 'invalid'){
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

    return(
    <div>
      <AppNavbar/>
      <Container className="App">
        {title}
        <Form className="form" onSubmit= {this.contactSubmit.bind(this)} >
          <Col>
          <Row form>
            <Col sm="2">
              <FormGroup>
                <Label for="cargo">Cargo</Label>
                <Input ref="cargo"
                  type="select"                  
                  value={this.state.fields.cargo}
                  onChange={e => {
                    this.handleChange(e.target.value, "cargo");
                  }}
                  >
                  {optionCargos }
                </Input>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="nombres">Nombres</Label>
                <Input ref="nombres"
                  type="text"
                  size="30"
                  placeholder="Nombres del empleado"                  
                  value={this.state.fields.nombres}
                  onChange={e => {
                    this.handleChange(e.target.value, "nombres");
                  }}
                  />
                  {messageNombres }
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
              {messageApellidos }
            </FormGroup>
          </Col>
        </Row>
      </Col>
      <Col>
      <Row form>
          <Col sm="2">
            <FormGroup>
              <Label for="salario">Salario</Label>
              <Input ref="salario"
                pattern="[0-9]*"
                title="Porfavor ingrese un numero valido"
                type="text"
                size="8"
                placeholder="Salario del empleado"
                value={this.state.fields.salario}
                onChange={e => {
                  this.handleChange(e.target.value, "salario");
                }}                
                />
              {messageSalario }
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="direccion">Direccion</Label>
              <Input ref="direccion"
                type="text"
                size="70"
                placeholder="Direccion del empleado"
                value={this.state.fields.direccion}
                onChange={e => {
                  this.handleChange(e.target.value, "direccion");
                }}
                />
              {messageDireccion }
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="numeroCelular">Numero Celular</Label>
              <Input ref="numeroCelular"
                pattern="[0-9]*"
                title="Porfavor ingrese un numero valido"
                type="text"
                size="13"
                placeholder="Celular"
                value={this.state.fields.numeroCelular}
                onChange={e => {
                  this.handleChange(e.target.value, "numeroCelular");
                }}
                />
              {messageCelular }
            </FormGroup>
          </Col>
        </Row>
            </Col>

          <Col sm="2">
            <FormGroup>
              <Label for="telefono">Telefono</Label>
              <Input ref="telefono"
                type="text"
                size="13"
                placeholder="Telefono"
                value={this.state.fields.telefono}
                onChange={e => {
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
                    <Input ref="contactoEmergenciaNombres"
                      type="text"
                      size="30"
                      placeholder="Nombres"
                      value={this.state.fields.contactoEmergenciaNombres}
                      onChange={e => {
                        this.handleChange(e.target.value, "contactoEmergenciaNombres");
                      }}
                      />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="contactoEmergenciaApellidos">Apellidos</Label>
                    <Input ref="contactoEmergenciaApellidos"
                      type="text"
                      size="30"
                      placeholder="Apellidos"                      
                      value={this.state.fields.contactoEmergenciaApellidos}
                      onChange={e => {
                        this.handleChange(e.target.value, "contactoEmergenciaApellidos");
                      }}                      
                      />
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <Label for="contactoEmergenciaTelefono">Telefono</Label>
                    <Input ref="contactoEmergenciaTelefono"
                      type="text"
                      size="13"
                      placeholder="Numero celular o telefonico"                      
                      value={this.state.fields.contactoEmergenciaTelefono}
                      onChange={e => {
                        this.handleChange(e.target.value, "contactoEmergenciaTelefono");
                      }} 
                      />
                  </FormGroup>
                </Col>
              </Row>
            </Container>
          </Col>
            {ubicacion }
          <Col>
           {messageLabel }
          </Col>
          <FormGroup>
            <Button color="primary" id="submit" type="submit">Guardar</Button>{' '}
            <Button color="secondary" tag={Link} to="/empleados">Regresar</Button>{' '}
            <Button color="secondary" onClick={this.resetForm}>Nuevo</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
    );
  }
}

export default withRouter(EmpleadoEdit);
