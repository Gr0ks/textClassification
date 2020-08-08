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
    const saved = await bot.saveToDB()
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

  static async saveTrainDataFromRequest(id, trainData) {
    const bot = await db.readFromDB(id, 'bot')
    if(bot) {
      if(Array.isArray(trainData)) {
        const classifierBot = new Bot(bot)
        const saved = await classifierBot.saveTrainData(trainData)
        if(saved) {
          console.log(chalk.green(`Save trainData ${bot.id} - ${bot.name} to DB`));
          classifierBot.train()
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
      } else {
        return {
          status: 400,
          ok: false,
          errors: [`Invalid training data`]
        }
      }
    } else {
      return {
        status: 400,
        ok: false,
        errors: [`Bot ${id} not found`]
      }
    }
  }

  async train() {
    const trainData = await db.readFromDB(this.id, 'trainData')
    const data = {}
    trainData.forEach(element => {
      for(let key in element) {
        if (!data[key]) {
          data[key] = []
        }
        data[key].push(element[key])
      }
    });
    const classifier = new Classifier()
    classifier.train(this.id, data)
  }

  async saveToDB() {
    const {name, id, email} = this
    await db.saveToDB(this.id, 'bot', {name, id, email})
    db.log()
    return true
  }

  async saveTrainData(trainData) {
    const oldtrainData = await db.readFromDB(this.id, 'trainData')
    const data = trainData.concat(oldtrainData ? oldtrainData : [])
    await db.saveToDB(this.id, 'trainData', data)
    return true
  }
}
