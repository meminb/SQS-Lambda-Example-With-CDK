'use strict';
var AWS = require("aws-sdk");
module.exports.handler = async (event) => {
  var sqs = AWS.SQS({ apiVersion: '2012-11-05' });
  const QUEUE_URL = process.env.SECOND_QUEUE_URL
  var params = {

    DelaySeconds: 2,

    MessageBody: JSON.stringify(event),
    QueueUrl: QUEUE_URL
  };

  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });
};
