class DB {
    constructor() {
      this.recordsCount = 0
    }

    async saveToDB(target, type, data) {
      if(!this[target]) {
        this[target] = {}
      }
      this[target][type] = data
      this.recordsCount++
      return true
    }

    async readFromDB(target, type) {
      if(!!this[target]) {
        if(!!this[target][type]) {
          return this[target][type]
        }
      }
    }

    log() {
        console.log(this)
    }
  }

module.exports = new DB();
