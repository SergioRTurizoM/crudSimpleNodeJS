const {v4: uudiv4} = require('uuid')


class Tarea {
  id = "";
  desc = "";
  status = false;

    constructor( desc){
        this.id = uudiv4()
        this.desc = desc;
        this.status = null;
    }

}

module.exports = Tarea;
