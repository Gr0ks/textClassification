const express = require('express');
const path = require('path');
const chalk = require('chalk');
const app = express();

app.use(express.json());

const db = {}

class Classifier {
  constructor({name, id, email}) {
    this.name = name
    this.id = id
    this.email = email
  }

  static async createFromRequest(reqData) {
    reqData.id = Number(Date.now())
    const classifier = new Classifier(reqData)
    const saved = await classifier.saveToDB(db)
    if(saved) {
      console.log(chalk.green(`Save Classifier ${this.id} - ${this.name} to DB`));
      return {
        status: 200,
        ok: true,
        token: classifier.id
      }
    } else {
      console.log(chalk.red(`Saving error ${this.id} - ${this.name}`));
      return {
        status: 500,
        ok: false,
        errors: ['Saving error']
      }
    }
  } 

  async saveToDB(db) {
    db[this.id] = this
        
    console.log(db)
    return true
  }
}

app.post('/api/createClassifier', async (req, res) => {
  
  const dataFromRequest = req.body;
  if(!!dataFromRequest.name && !!dataFromRequest.email) {
    console.log(chalk.green(`Create new Classifier from ${req.ip} with: ${JSON.stringify(dataFromRequest)}`));
    const result = await Classifier.createFromRequest(dataFromRequest)
    if(result.ok) {
      const {status, ok, token} = result
      res.status(status).json({ok, token});
    } else {
      const {status, ok, errors} = result
      res.status(status).json({ok, errors});
    }
  } else {
    console.log(chalk.yellow(`Try to request from ${req.ip} with: ${JSON.stringify(dataFromRequest)}`));
    res.status(400).json({ok: false, errors: ['Invalid request data']});
  }
});

app.listen(9980, () => {
  console.log('Server has been started on port 9980...')
})
