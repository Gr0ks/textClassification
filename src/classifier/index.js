const natural = require('natural');

module.exports = class Classifier {
  constructor() {
    this.classifier = new natural.BayesClassifier();
  }

  /**
   * 
   * @param {Object} trainingData - {result1: [data1, data2, ...], result2: [data3, data4, ...], ...}
   */
  async train(id, trainingData) {
    for(let key in trainingData) {
      trainingData[key].forEach(data=>{this.classifier.addDocument(data, key);});	
    }
    this.classifier.train();
    this.classifier.save(`${id}.json`, function(err, classifier) {
      // the classifier is saved to the classifier.json file!
    });
  }

  async classify(id, data) {
    return new Promise((res, rej) => {
      natural.BayesClassifier.load(`${id}.json`, null, function(err, classifier) {
        res(classifier.classify(data))
      });
    })
  }
}
