const express = require('express');
const chalk = require('chalk');
const Bot = require('./src/bot/index.js');

const app = express();

app.use(express.json());

app.post('/api/createClassifier', async (req, res) => {
  
  const dataFromRequest = req.body;
  if(!!dataFromRequest.name && !!dataFromRequest.email) {
    console.log(chalk.green(`Create new Classifier from ${req.ip} with: ${JSON.stringify(dataFromRequest)}`));
    const result = await Bot.createFromRequest(dataFromRequest)
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

app.post('/api/trainClassifier', async (req, res) => {
  
  const dataFromRequest = req.body;
  if(!!dataFromRequest.token && !!dataFromRequest.trainData) {
    console.log(chalk.green(`Train Classifier from ${req.ip}`));
    const result = await Bot.saveTrainDataFromRequest(dataFromRequest.token, dataFromRequest.trainData)
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
