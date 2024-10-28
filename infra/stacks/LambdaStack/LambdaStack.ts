import { Duration, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import {
  Code,
  Function as LambdaFunction,
  Runtime,
  Tracing
} from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { Lambdas, Stacks } from '../../constants';
import { FileExcludeList } from './constants';
import {
  ConvertArnsToCdkResourcesInput,
  ConvertArnsToCdkResourcesOutput,
  CreateAppServerFunctionOutput,
  CreateArticleServerFunctionOutput,
  CreateUserServerFunctionOutput,
  GetGlobalFunctionPropsInput,
  GetGlobalFunctionPropsOutput,
  GlobalProps,
  LambdaStackProps
} from './types';
import { getEnvironmentVariables } from './utils';

export class LambdaStack extends Stack {
  public readonly appServerFunction: LambdaFunction;
  public readonly userServerFunction: LambdaFunction;
  public readonly articleServerFunction: LambdaFunction;
  private readonly globalProps: GlobalProps;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);
    const { roleArn } = props;

    const { role } = this.convertArnsToCdkResources({
      roleArn
    });

    this.globalProps = this.getGlobalFunctionPropsOutput({ role });

    this.appServerFunction = this.createAppServerFunction();
    this.userServerFunction = this.createUserServiceFunction();
    this.articleServerFunction = this.createArticleServiceFunction();
  }

  private createAppServerFunction(): CreateAppServerFunctionOutput {
    const appServerFunction = new LambdaFunction(this, Lambdas.AppServerFunction, {
      handler: 'apps/app/server.handler',
      description: 'The lambda function that handles all user related requests',
      ...this.globalProps
    });

    appServerFunction.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));

    return appServerFunction;
  }

  private createUserServiceFunction(): CreateUserServerFunctionOutput {
    const userServerFunction = new LambdaFunction(this, Lambdas.UserServerFunction, {
      handler: 'apps/user/server.handler',
      description: 'The lambda function that handles all user related requests',
      ...this.globalProps
    });

    /**
     *
     * Grant the Api Gateway service permission to invoke this Lambda function
     *
     * Reference: https://repost.aws/knowledge-center/api-gateway-http-lambda-integrations
     *
     */
    userServerFunction.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));

    return userServerFunction;
  }

  private createArticleServiceFunction(): CreateArticleServerFunctionOutput {
    const articleServerFunction = new LambdaFunction(
      this,
      Lambdas.ArticleServerFunction,
      {
        handler: 'apps/article/article.handler',
        description: 'The lambda function that handles all article related requests',
        ...this.globalProps
      }
    );

    articleServerFunction.grantInvoke(
      new ServicePrincipal('apigateway.amazonaws.com')
    );

    return articleServerFunction;
  }

  private getGlobalFunctionPropsOutput({
    role
  }: GetGlobalFunctionPropsInput): GetGlobalFunctionPropsOutput {
    return {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset('../', {
        exclude: FileExcludeList
      }),
      role,
      timeout: Duration.seconds(30),
      memorySize: 256,
      tracing: Tracing.ACTIVE,
      environment: getEnvironmentVariables([
        'DATABASE_HOST',
        'DATABASE_NAME',
        'DATABASE_USER',
        'DATABASE_PASSWORD',
        'DATABASE_PORT',
        'AUTH_JWT_SECRET'
      ])
    };
  }

  private convertArnsToCdkResources({
    roleArn
  }: ConvertArnsToCdkResourcesInput): ConvertArnsToCdkResourcesOutput {
    const role = Role.fromRoleArn(this, `${Stacks.Lambda}-execution-role`, roleArn);
    return {
      role
    };
  }
}
