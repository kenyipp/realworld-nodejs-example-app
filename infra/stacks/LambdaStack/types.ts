import { StackProps } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { FunctionProps, Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';

export interface LambdaStackProps extends StackProps {
  roleArn: string;
}

export type GlobalProps = Required<
  Pick<
    FunctionProps,
    | 'runtime'
    | 'code'
    | 'role'
    | 'timeout'
    | 'memorySize'
    | 'tracing'
    | 'environment'
  >
>;

/**
 *
 * function: getGlobalFunctionProps
 *
 */
export interface GetGlobalFunctionPropsInput {
  role: IRole;
}

export type GetGlobalFunctionPropsOutput = GlobalProps;

/**
 *
 * function: convertArnsToCdkResources
 *
 */
export interface ConvertArnsToCdkResourcesInput {
  roleArn: string;
}

export interface ConvertArnsToCdkResourcesOutput {
  role: IRole;
}

/**
 *
 * function: createAppServerFunction
 *
 */
export type CreateAppServerFunctionOutput = LambdaFunction;

/**
 *
 * function: createUserServerFunction
 *
 */
export type CreateUserServerFunctionOutput = LambdaFunction;

/**
 *
 * function: createArticleServerFunction
 *
 */
export type CreateArticleServerFunctionOutput = LambdaFunction;
