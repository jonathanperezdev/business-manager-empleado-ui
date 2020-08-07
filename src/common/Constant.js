const EMPLEADO_API = '/empleado';

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

  //Table options
  static get OPTIONS_TABLE() {
    return OPTIONS_TABLE;
  }
}

export default Constant;
