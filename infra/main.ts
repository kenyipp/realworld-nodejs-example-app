import 'dotenv/config';

import { CdkGraph, FilterPreset } from '@aws/pdk/cdk-graph';
import {
  CdkGraphDiagramPlugin,
  DiagramFormat
} from '@aws/pdk/cdk-graph-plugin-diagram';
import { App, Environment } from 'aws-cdk-lib';

import { Stacks } from './constants';
import { ApiGatewayStack, LambdaStack } from './stacks';
import { config } from './utils';

// eslint-disable-next-line no-void, func-names
void (async function () {
  const app = new App();

  const env: Environment = {
    region: config.aws.region,
    account: config.aws.accountId
  };

  const lambdaStack = new LambdaStack(app, Stacks.Lambda, {
    env,
    roleArn: config.aws.arn.role.lambda
  });

  new ApiGatewayStack(app, Stacks.ApiGateway, {
    env,
    userFunctionArn: lambdaStack.userServerFunction.functionArn,
    appFunctionArn: lambdaStack.appServerFunction.functionArn,
    articleServerFunctionArn: lambdaStack.articleServerFunction.functionArn
  });

  // Generate a diagram for the whole architecture
  const group = new CdkGraph(app, {
    plugins: [
      new CdkGraphDiagramPlugin({
        diagrams: [
          {
            name: 'conduit-api-stack-diagram',
            title: 'Conduit Api Stack Diagram',
            format: DiagramFormat.PNG,
            theme: 'light',
            filterPlan: {
              preset: FilterPreset.COMPACT
            }
          }
        ]
      })
    ]
  });

  app.synth();

  await group.report();
})();
