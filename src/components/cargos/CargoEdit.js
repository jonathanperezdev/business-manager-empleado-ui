import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Col, Form, FormGroup, Label, Button, Input, Alert} from 'reactstrap';
import AppNavbar from 'menu/AppNavbar';
import 'css/App.css';
import Constant from 'common/Constant';
import axios from 'axios';
import {validateRequired} from 'common/Validator';

const PATH_CARGO_SERVICE = Constant.EMPLEADO_API+Constant.CARGO_SERVICE;

class CargoEdit extends Component {

  emptyState = {
    nombre: '',
    descripcion: '',
    funciones: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      fields: this.emptyState,
      errors: {},
      formState: ''
    }    
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      axios.get(PATH_CARGO_SERVICE+`/${this.props.match.params.id}`)
        .then(result =>
            this.setState({fields: result.data}))
        .catch(error => this.setState({
          error,
          isLoading: false
        }));
    }
  }

  resetForm = () =>{
    let fields = this.state.fields;

    fields.nombre = '';
    fields.descripcion = '';
    fields.funciones= '';

    this.setState({fields: fields});
  }

  handleValidation = () =>{
    let fields = this.state.fields;
    let errors = {nombre: validateRequired(fields.nombre, "cargo")};
    let formState = ''

    if(errors.nombre || errors.direccion){
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
        url: (id) ? PATH_CARGO_SERVICE+'/'+(id) : PATH_CARGO_SERVICE,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(fields)
      });

      this.setState({formState: 'saved'})
    }
  }

  handleChange(field, e){
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({fields});
  }

  render() {
    const {fields, formState, errors} = this.state;
    const id = fields["id"];

    const title = <h2>{id ? 'Modificar Cargo' : 'Agregar Cargo'}</h2>;

    let messageLabel;
    if(formState == 'invalid'){
      messageLabel = <Alert color="danger">El fomulario tiene errores</Alert>;
    }else if (formState == 'saved') {
      messageLabel = <Alert color="success">El cargo fue guardado satisfactoriamente</Alert>;
    }

    let messageNombre;
    if(errors["nombre"]){
      messageNombre = <Alert color="danger">{this.state.errors["nombre"]}</Alert>;
    }

    return(
    <div>
      <AppNavbar/>
      <Container className="App">
        {title}
        <Form className="form" onSubmit= {this.contactSubmit.bind(this)} >
          <Col>
            <FormGroup>
              <Label for="nombre">Cargo</Label>
              <Input ref="nombre"
                type="text"
                size="30"
                placeholder="Cargo"
                onChange={this.handleChange.bind(this, "nombre")}
                value={this.state.fields["nombre"]}/>
              {messageNombre}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="descripcion">Descripcion</Label>
              <textarea ref="descripcion"
                cols={70}
                rows={3}
                maxLength={300}
                placeholder="descripcion"
                onChange={this.handleChange.bind(this, "descripcion")}
                value={this.state.fields["descripcion"]}/>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="funciones">Funciones</Label>
              <textarea ref="funciones"
                  cols={70}
                  rows={3}
                  maxLength={300}
                  placeholder="funciones"
                  onChange={this.handleChange.bind(this, "funciones")}
                  value={this.state.fields["funciones"]}/>
            </FormGroup>
          </Col>
          <Col>
           {messageLabel }
          </Col>
          <FormGroup>
            <Button color="primary" id="submit" type="submit">Guardar</Button>{' '}
            <Button color="secondary" tag={Link} to="/cargos">Regresar</Button>{' '}
            <Button color="secondary" onClick={this.resetForm}>Nuevo</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
    );
  }
}

export default withRouter(CargoEdit);
