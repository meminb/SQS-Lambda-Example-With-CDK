
import { SQS } from 'aws-sdk';


const QUEUE_URL = process.env.SECOND_QUEUE_URL
exports.handler = async (event, context) => {

    var sqs = new SQS({ apiVersion: '2012-11-05' });

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
}