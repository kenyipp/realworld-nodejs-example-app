import { StackProps } from 'aws-cdk-lib';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export interface ApiGatewayStackProps extends StackProps {
  userFunctionArn: string;
  appFunctionArn: string;
  articleServerFunctionArn: string;
}

/**
 *
 * function: setupAppApiGateway
 *
 */
export type SetupAppApiGatewayOutput = HttpApi;

/**
 *
 * function: setupAppServerIntegration
 *
 */
export interface SetupAppServerIntegrationInput {
  appFunctionArn: string;
}

export type SetupAppServerIntegrationOutput = HttpLambdaIntegration;

/**
 *
 * function: setupArticleServerIntegration
 *
 */
export interface SetupArticleServerIntegrationInput {
  articleServerFunctionArn: string;
}

export type SetupArticleServerIntegrationOutput = HttpLambdaIntegration;

/**
 *
 * function: setupUserServerIntegration
 *
 */
export interface SetupUserServerIntegrationInput {
  userFunctionArn: string;
}

export type SetupUserServerIntegrationOutput = HttpLambdaIntegration;

/**
 *
 * function: mapAppApiGatewayRoutes
 *
 */
export interface MapAppApiGatewayRoutesInput {
  appApiGateway: HttpApi;
  appServerIntegration: HttpLambdaIntegration;
  userServerIntegration: HttpLambdaIntegration;
  articleServerIntegration: HttpLambdaIntegration;
}

export type MapAppApiGatewayRoutesOutput = void;

/**
 *
 * function: setupApiGatewayDomain
 *
 */
export interface SetupApiGatewayDomainInput {
  appApiGateway: HttpApi;
}

export type SetupApiGatewayDomainOutput = void;
