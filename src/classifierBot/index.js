const chalk = require('chalk');
const db =require('../db');

module.exports = class ClassifierBot {
  constructor({ name, id, email }) {
    this.name = name
    this.id = id
    this.email = email
  }

  static async createFromRequest(reqData) {
    reqData.id = Number(Date.now())
    const classifierBot = new ClassifierBot(reqData)
    const saved = await classifierBot.saveToDB()
    if (saved) {
      console.log(chalk.green(`Save Classifier ${reqData.id} - ${reqData.name} to DB`));
      return {
        status: 200,
        ok: true,
        token: classifierBot.id
      }
    } else {
      console.log(chalk.red(`Saving error ${reqData.id} - ${reqData.name}`));
      return {
        status: 500,
        ok: false,
        errors: ['Saving error']
      }
    }
  }

  static async saveTrainData(token, data) {
    await db.saveTrainData(token, data)
  }

  async saveToDB() {
    await db.saveBotToDB(this)
    return true
  }
}