import React, { Component } from 'react';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CargoEdit from 'components/cargos/CargoEdit';
import CargosList from 'components/cargos/CargosList';
import EmpleadosList from 'components/empleados/EmpleadosList';
import EmpleadoEdit from 'components/empleados/EmpleadoEdit';
import UbicacionesList from 'components/ubicaciones/UbicacionesList';
import UbicacionEdit from 'components/ubicaciones/UbicacionEdit';
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
          <Route path='/empleados' exact={true} component={EmpleadosList}/>
          <Route path='/empleado/:id' exact={true} component={EmpleadoEdit}/>
          <Route path='/ubicaciones' exact={true} component={UbicacionesList}/>
          <Route path='/ubicacion/:id' component={UbicacionEdit}/>
          <Route path='/configuraUbicacion/:idUbicacion' exact={true} component={ConfiguraUbicacion}/>
          <Route path='/addEmpleadoUbicacion/:idUbicacion' exact={true} component={AddEmpleadoUbicacion}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
