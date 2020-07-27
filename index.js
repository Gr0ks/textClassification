const express = require('express');
const path = require('path');
const chalk = require('chalk');
const ClassifierBot = require('./src/classifierBot/index.js');

const app = express();

app.use(express.json());

app.post('/api/createClassifier', async (req, res) => {
  
  const dataFromRequest = req.body;
  if(!!dataFromRequest.name && !!dataFromRequest.email) {
    console.log(chalk.green(`Create new Classifier from ${req.ip} with: ${JSON.stringify(dataFromRequest)}`));
    const result = await ClassifierBot.createFromRequest(dataFromRequest)
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
