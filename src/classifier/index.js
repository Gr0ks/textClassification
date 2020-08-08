const natural = require('natural');

module.exports = class Classifier {
  constructor() {
    this.classifier = new natural.BayesClassifier();
  }

  /**
   * 
   * @param {Object} trainingData - {result1: [data1, data2, ...], result2: [data3, data4, ...], ...}
   */
  async train(id ,trainingData) {
    for(let key in trainingData) {
      trainingData[key].forEach(data=>{this.classifier.addDocument(data, key);});	
    }
    classifier.train();
    classifier.save(`./classifiers/${id}.json`, function(err, classifier) {
      // the classifier is saved to the classifier.json file!
    });
  }

  async classify(id, data) {
    let result = null
    await this.classifier.load(`${id}.json`, null, function(err, classifier) {
      result = this.classifier.classify(data)
    });
    return result
  }
}
