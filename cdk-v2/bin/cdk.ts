#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcsCdkStack } from '../lib/ecs_cdk-stack';
import { WillkommenFargate } from '../lib/test'
import { EcsCdkStackOrig } from '../lib/ecs_cdk-stack-orig';

const app = new cdk.App();

const env = {
  region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  stackName: app.node.tryGetContext('stackName') || process.env.STACK_NAME || 'EcsCdkStack'
};

new EcsCdkStackOrig(app, env.stackName, { env });
