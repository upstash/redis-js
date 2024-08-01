import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';

export class AwsCdkTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const counterFunction = new nodejs.NodejsFunction(this, 'CounterFunction', {
      entry: 'api/counter.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || '',
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',
      },
      bundling: {
        format: nodejs.OutputFormat.ESM,
        target: "node20",
        nodeModules: ['@upstash/redis'],
      },
    });

    const counterFunctionUrl = counterFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, "counterFunctionUrlOutput", {
      value: counterFunctionUrl.url,
    })
  }
}
