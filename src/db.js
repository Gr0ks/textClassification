class DB {
    constructor() {
      this.recordsCount = 0
    }

    async saveBotToDB({name, id, email}) {
      this[id] = {id,name,email}
      this.recordsCount++
      this.log()
      return true
    }

    async saveTrainData(id, data) {
        this[id].trainData = data
        return true
    }

    log() {
        console.log(this)
    }
  }

module.exports = new DB();
