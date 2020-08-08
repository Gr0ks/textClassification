const db = require('../db');
const chalk = require('chalk');
const Classifier = require('../classifier');

module.exports = class Bot {
  constructor({name, id, email}) {
    this.name = name
    this.id = id
    this.email = email
  }

  static async createFromRequest(reqData) {
    reqData.id = Number(Date.now())
    const bot = new Bot(reqData)
    const saved = await bot.saveToDB(db)
    if(saved) {
      console.log(chalk.green(`Save Classifier ${bot.id} - ${bot.name} to DB`));
      return {
        status: 200,
        ok: true,
        token: bot.id
      }
    } else {
      console.log(chalk.red(`Saving error ${bot.id} - ${bot.name}`));
      return {
        status: 500,
        ok: false,
        errors: ['Saving error']
      }
    }
  } 

  async saveToDB(db) {
    const {name, id, email} = this
    await db.saveToDB(this.id, 'bot', {name, id, email})
    db.log()
    return true
  }
}
