import React, { Component } from 'react';
import 'css/App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CargosList from 'components/cargos/CargosList';
import CargoEdit from 'components/cargos/CargoEdit';
import UbicacionesList from 'components/ubicaciones/UbicacionesList';
import UbicacionEdit from 'components/ubicaciones/UbicacionEdit';
import EmpleadosList from 'components/empleados/EmpleadosList';
import EmpleadoEdit from 'components/empleados/EmpleadoEdit';
import ConfiguraUbicacion from 'components/ubicaciones/ConfiguraUbicacion';
import AddEmpleadoUbicacion from 'components/ubicaciones/AddEmpleadoUbicacion';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/cargos' exact={true} component={CargosList}/>
          <Route path='/cargo/:id' component={CargoEdit}/>
          <Route path='/ubicaciones' exact={true} component={UbicacionesList}/>
          <Route path='/ubicacion/:id' component={UbicacionEdit}/>
          <Route path='/empleados' exact={true} component={EmpleadosList}/>
          <Route path='/empleado/:id' exact={true} component={EmpleadoEdit}/>
          <Route path='/configuraUbicacion/:idUbicacion' exact={true} component={ConfiguraUbicacion}/>
          <Route path='/addEmpleadoUbicacion/:idUbicacion' exact={true} component={AddEmpleadoUbicacion}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
