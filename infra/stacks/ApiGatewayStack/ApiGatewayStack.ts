import { CfnOutput, Stack } from 'aws-cdk-lib';
import {
  CfnApiMapping,
  CfnDomainName,
  CorsHttpMethod,
  HttpApi,
  HttpMethod
} from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

import { Secrets, Stacks } from '../../constants';
import { config } from '../../utils';
import {
  ApiGatewayStackProps,
  MapAppApiGatewayRoutesInput,
  MapAppApiGatewayRoutesOutput,
  SetupApiGatewayDomainInput,
  SetupApiGatewayDomainOutput,
  SetupAppApiGatewayOutput,
  SetupAppServerIntegrationInput,
  SetupAppServerIntegrationOutput,
  SetupArticleServerIntegrationInput,
  SetupArticleServerIntegrationOutput,
  SetupUserServerIntegrationInput,
  SetupUserServerIntegrationOutput
} from './types';

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);
    const { userFunctionArn, appFunctionArn, articleServerFunctionArn } = props;

    const appApiGateway = this.setupAppApiGateway();

    const userServerIntegration = this.setupUserServerIntegration({
      userFunctionArn
    });

    const appServerIntegration = this.setupAppServerIntegration({
      appFunctionArn
    });

    const articleServerIntegration = this.setupArticleServerIntegration({
      articleServerFunctionArn
    });

    this.mapAppApiGatewayRoutes({
      appApiGateway,
      appServerIntegration,
      userServerIntegration,
      articleServerIntegration
    });

    this.setupApiGatewayDomain({
      appApiGateway
    });
  }

  private mapAppApiGatewayRoutes({
    appApiGateway,
    appServerIntegration,
    articleServerIntegration,
    userServerIntegration
  }: MapAppApiGatewayRoutesInput): MapAppApiGatewayRoutesOutput {
    /**
     *
     * App Routes
     *
     */
    appApiGateway.addRoutes({
      path: '/',
      methods: [HttpMethod.GET],
      integration: appServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/health-check',
      methods: [HttpMethod.GET],
      integration: appServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/swagger.json',
      methods: [HttpMethod.GET],
      integration: appServerIntegration
    });

    /**
     *
     * User Routes
     *
     */
    appApiGateway.addRoutes({
      path: '/api/profiles/:username',
      methods: [HttpMethod.GET],
      integration: userServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/users',
      methods: [HttpMethod.POST],
      integration: userServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/users/login',
      methods: [HttpMethod.POST],
      integration: userServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/profiles/:username/follow',
      methods: [HttpMethod.POST, HttpMethod.DELETE],
      integration: userServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/user',
      methods: [HttpMethod.PUT, HttpMethod.GET],
      integration: userServerIntegration
    });

    /**
     *
     * Article Routes
     *
     */
    appApiGateway.addRoutes({
      path: '/api/articles',
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: articleServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/articles/feed',
      methods: [HttpMethod.GET],
      integration: articleServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/articles/:slug',
      methods: [HttpMethod.GET, HttpMethod.PUT, HttpMethod.DELETE],
      integration: articleServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/articles/:slug/favorite',
      methods: [HttpMethod.POST, HttpMethod.DELETE],
      integration: articleServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/articles/:slug/comments',
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: articleServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/articles/:slug/comments/:id',
      methods: [HttpMethod.DELETE],
      integration: articleServerIntegration
    });

    appApiGateway.addRoutes({
      path: '/api/tags',
      methods: [HttpMethod.GET],
      integration: articleServerIntegration
    });
  }

  private setupUserServerIntegration({
    userFunctionArn
  }: SetupUserServerIntegrationInput): SetupUserServerIntegrationOutput {
    const lambdaFunction = LambdaFunction.fromFunctionArn(
      this,
      `${Stacks.ApiGateway}-user-server-function`,
      userFunctionArn
    );

    const integration = new HttpLambdaIntegration(
      `${Stacks.ApiGateway}-user-server-integration`,
      lambdaFunction
    );
    return integration;
  }

  private setupArticleServerIntegration({
    articleServerFunctionArn
  }: SetupArticleServerIntegrationInput): SetupArticleServerIntegrationOutput {
    const lambdaFunction = LambdaFunction.fromFunctionArn(
      this,
      `${Stacks.ApiGateway}-article-server-function`,
      articleServerFunctionArn
    );

    const integration = new HttpLambdaIntegration(
      `${Stacks.ApiGateway}-article-server-integration`,
      lambdaFunction
    );
    return integration;
  }

  private setupAppServerIntegration({
    appFunctionArn
  }: SetupAppServerIntegrationInput): SetupAppServerIntegrationOutput {
    const lambdaFunction = LambdaFunction.fromFunctionArn(
      this,
      `${Stacks.ApiGateway}-app-server-function`,
      appFunctionArn
    );

    const integration = new HttpLambdaIntegration(
      `${Stacks.ApiGateway}-app-server-integration`,
      lambdaFunction
    );
    return integration;
  }

  private setupApiGatewayDomain({
    appApiGateway
  }: SetupApiGatewayDomainInput): SetupApiGatewayDomainOutput {
    const domainArn = Secret.fromSecretNameV2(
      this,
      `${Stacks.ApiGateway}-domain-cert`,
      Secrets.DomainCert
    );

    const domain = new CfnDomainName(this, `${Stacks.ApiGateway}-domain-name`, {
      domainName: `conduit-api-${config.nodeEnv}.kenyip.cc`,
      domainNameConfigurations: [
        {
          certificateArn: domainArn.secretValue.toString(),
          endpointType: 'REGIONAL'
        }
      ]
    });

    new CfnApiMapping(this, `${Stacks.ApiGateway}-base-api-mapping`, {
      apiId: appApiGateway.apiId,
      domainName: domain.ref,
      stage: appApiGateway.defaultStage?.stageName || 'default'
    });
  }

  private setupAppApiGateway(): SetupAppApiGatewayOutput {
    const httpApi = new HttpApi(this, `${Stacks.ApiGateway}-app-api-gateway`, {
      apiName: `conduit-api-${config.nodeEnv}`,
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.PATCH
        ],
        allowHeaders: [
          'authorization',
          'x-requested-with',
          'content-type',
          'accept',
          'user-agent',
          'referer'
        ]
      }
    });

    new CfnOutput(this, 'AppApiGatewayEndpoint', { value: httpApi.apiEndpoint });

    return httpApi;
  }
}
