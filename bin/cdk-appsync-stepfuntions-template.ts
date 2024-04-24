#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkAppsyncStepfuntionsTemplateStack } from '../lib/cdk-appsync-stepfuntions-template-stack';

const app = new cdk.App();
new CdkAppsyncStepfuntionsTemplateStack(app, 'CdkAppsyncStepfuntionsTemplateStack');
