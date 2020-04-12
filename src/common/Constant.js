const EMPLEADO_API = '/empleado/v1/api';

//Cargos
const CARGO_SERVICE = '/cargo';
const CARGOS_SERVICE = '/cargos';

//Ubicaciones
const UBICACION_SERVICE = '/ubicacion';
const UBICACIONES_SERVICE = '/ubicaciones';
const UBICACION_CONFIGURACION = '/ubicacion/configuracion';

//EMPLEADOS_SERVICE
const EMPLEADO_SERVICE = '/empleado';
const EMPLEADOS_SERVICE = '/empleados';
const EMPLEADOS_SEARCH_SERVICE = '/empleados/search';
const OFICIALES_SEARCH_SERVICE = '/empleados/oficial';
const INGENIEROS_SEARCH_SERVICE = '/empleados/ingeniero';
const EMPLEADOS_UBICACION_SERVICE = '/empleados/ubicacion/';
const EMPLEADO_UBICACION = '/empleado/ubicacion/';
const EMPLEADOS_TIPO_UBICACION_SEARCH = '/empleados/searchWithTipoUbicacion';

//Tipo documentos
const TIPO_DOCUMENTOS_SERVICE= '/tipoDocumentos';


//Table options
const OPTIONS_TABLE = {
  alwaysShowAllBtns: false,
  hideSizePerPage: true,
  firstPageText: '<<',
  prePageText: '<',
  nextPageText: '>',
  lastPageText: '>>',
  showTotal: false
};

class Constant {

  static get EMPLEADO_API() {
    return EMPLEADO_API;
  }

  //Cargos
  static get CARGO_SERVICE() {
    return CARGO_SERVICE;
  }

  static get CARGOS_SERVICE() {
    return CARGOS_SERVICE;
  }

  //Ubicaciones
  static get UBICACION_SERVICE() {
    return UBICACION_SERVICE;
  }

  static get UBICACIONES_SERVICE() {
    return UBICACIONES_SERVICE;
  }

  static get UBICACION_CONFIGURACION() {
    return UBICACION_CONFIGURACION;
  }

  //Empleados
  static get EMPLEADO_SERVICE() {
    return EMPLEADO_SERVICE;
  }

  static get EMPLEADOS_SERVICE() {
    return EMPLEADOS_SERVICE;
  }

  static get EMPLEADOS_SEARCH_SERVICE() {
    return EMPLEADOS_SEARCH_SERVICE;
  }

  static get OFICIALES_SEARCH_SERVICE() {
    return OFICIALES_SEARCH_SERVICE;
  }

  static get INGENIEROS_SEARCH_SERVICE() {
    return INGENIEROS_SEARCH_SERVICE;
  }

  static get EMPLEADOS_UBICACION_SERVICE() {
    return EMPLEADOS_UBICACION_SERVICE;
  }
  static get EMPLEADO_UBICACION() {
    return EMPLEADO_UBICACION;
  }

  static get EMPLEADOS_TIPO_UBICACION_SEARCH(){
    return EMPLEADOS_TIPO_UBICACION_SEARCH;
  }

  static get TIPO_DOCUMENTOS_SERVICE(){
    return TIPO_DOCUMENTOS_SERVICE;
  }

  //Table options
  static get OPTIONS_TABLE() {
    return OPTIONS_TABLE;
  }
}

export default Constant;
