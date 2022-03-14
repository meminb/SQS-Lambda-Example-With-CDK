import { Aws } from "@aws-cdk/core";

import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_sqs, aws_iam, aws_lambda, aws_lambda_event_sources, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
export class SqsLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);



    const queue1 = new aws_sqs.Queue(this, 'FirstQueue', {
      visibilityTimeout: Duration.seconds(30),
      queueName: "TheFirstQueue"
    });
    const queue2 = new aws_sqs.Queue(this, 'SecondQueue', {
      visibilityTimeout: Duration.seconds(30),
      queueName: "TheSecondQueue"
    });




    /*
        //Thundra APM Instrumented
    
    
        const thundraApiKey = "<Thundra API Key>";
        const thundraAWSAccountNo = 269863060030;
        const thundraNodeLayerVersion = 96; // or any other version 
        const thundraLayer = LayerVersion.fromLayerVersionArn(
          this,
          "ThundraLayer",
          `arn:aws:lambda:${Aws.REGION}:${thundraAWSAccountNo}:layer:thundra-lambda-node-layer:${thundraNodeLayerVersion}`
        );
        const lambdaFunction = new aws_lambda.Function(this, 'lambdaFunction1', {
          timeout: Duration.seconds(30),
          code: aws_lambda.Code.fromAsset('lib/src'),
          handler: 'thundra_handler.wrapper',
          functionName: 'DemoLambdaFunction',
          runtime: aws_lambda.Runtime.NODEJS_12_X,
          environment: {
            THUNDRA_AGENT_LAMBDA_HANDLER: "handler.handler",
            THUNDRA_APIKEY: thundraApiKey,
            SECOND_QUEUE_URL: queue2.queueUrl
          },
          layers: [
            thundraLayer
          ]
        });
    
    */


    // Without Thundra APM

    const lambdaFunction = new aws_lambda.Function(this, 'lambdaFunction1', {
      code: aws_lambda.Code.fromAsset('lib/src'),
      handler: 'handler.handler',
      functionName: 'DemoLambdaFunction',
      runtime: aws_lambda.Runtime.NODEJS_12_X,
      environment: {
        SECOND_QUEUE_URL: queue2.queueUrl
      }
    });







    lambdaFunction.addToRolePolicy(new aws_iam.PolicyStatement({
      effect: aws_iam.Effect.ALLOW,
      resources: [queue2.queueArn],
      actions: ["*"],
    }))

    const lambdaEventSource = new aws_lambda_event_sources.SqsEventSource(queue1, {
      batchSize: 1
    });

    lambdaFunction.addEventSource(lambdaEventSource);
  }
}
