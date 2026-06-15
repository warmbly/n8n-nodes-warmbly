import type { INodeProperties } from 'n8n-workflow';

import { campaignOperations, campaignFields } from './campaign';
import { campaignStepOperations, campaignStepFields } from './campaignStep';
import { campaignVariantOperations, campaignVariantFields } from './campaignVariant';
import { mailboxOperations, mailboxFields } from './mailbox';
import { contactOperations, contactFields } from './contact';
import { contactNoteOperations, contactNoteFields } from './contactNote';
import { uniboxOperations, uniboxFields } from './unibox';
import { pipelineOperations, pipelineFields } from './pipeline';
import { dealOperations, dealFields } from './deal';
import { crmTaskOperations, crmTaskFields } from './crmTask';
import { crmTaskTypeOperations, crmTaskTypeFields } from './crmTaskType';
import { templateOperations, templateFields } from './template';
import { analyticsOperations, analyticsFields } from './analytics';
import { auditLogOperations, auditLogFields } from './auditLog';
import { apiKeyOperations, apiKeyFields } from './apiKey';
import { integrationOperations, integrationFields } from './integration';
import { automationOperations, automationFields } from './automation';
import { webhookOperations, webhookFields } from './webhook';
import { warmupRoutingOperations, warmupRoutingFields } from './warmupRouting';
import { outreachOperations, outreachFields } from './outreach';
import { deliverabilityOperations, deliverabilityFields } from './deliverability';
import { deadLetterOperations, deadLetterFields } from './deadLetter';
import { teamOperations, teamFields } from './team';
import { workspaceOperations, workspaceFields } from './workspace';

export const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Analytics',
			value: 'analytics',
		},
		{
			name: 'API Key',
			value: 'apiKey',
		},
		{
			name: 'Audit Log',
			value: 'auditLog',
		},
		{
			name: 'Automation',
			value: 'automation',
		},
		{
			name: 'Campaign',
			value: 'campaign',
		},
		{
			name: 'Campaign A/B Variant',
			value: 'campaignVariant',
		},
		{
			name: 'Campaign Step',
			value: 'campaignStep',
		},
		{
			name: 'Contact',
			value: 'contact',
		},
		{
			name: 'Contact Note',
			value: 'contactNote',
		},
		{
			name: 'CRM Task',
			value: 'crmTask',
		},
		{
			name: 'CRM Task Type',
			value: 'crmTaskType',
		},
		{
			name: 'Dead Letter',
			value: 'deadLetter',
		},
		{
			name: 'Deal',
			value: 'deal',
		},
		{
			name: 'Deliverability',
			value: 'deliverability',
		},
		{
			name: 'Integration',
			value: 'integration',
		},
		{
			name: 'Mailbox',
			value: 'mailbox',
		},
		{
			name: 'Outreach Settings',
			value: 'outreach',
		},
		{
			name: 'Pipeline',
			value: 'pipeline',
		},
		{
			name: 'Reply Template',
			value: 'template',
		},
		{
			name: 'Team',
			value: 'team',
		},
		{
			name: 'Unibox',
			value: 'unibox',
		},
		{
			name: 'Warmup Routing Rule',
			value: 'warmupRouting',
		},
		{
			name: 'Webhook',
			value: 'webhook',
		},
		{
			name: 'Workspace',
			value: 'workspace',
		},
	],
	default: 'campaign',
};

export const operationProperties: INodeProperties[] = [
	...campaignOperations,
	...campaignStepOperations,
	...campaignVariantOperations,
	...mailboxOperations,
	...contactOperations,
	...contactNoteOperations,
	...uniboxOperations,
	...pipelineOperations,
	...dealOperations,
	...crmTaskOperations,
	...crmTaskTypeOperations,
	...templateOperations,
	...analyticsOperations,
	...auditLogOperations,
	...apiKeyOperations,
	...integrationOperations,
	...automationOperations,
	...webhookOperations,
	...warmupRoutingOperations,
	...outreachOperations,
	...deliverabilityOperations,
	...deadLetterOperations,
	...teamOperations,
	...workspaceOperations,
];

export const fieldProperties: INodeProperties[] = [
	...campaignFields,
	...campaignStepFields,
	...campaignVariantFields,
	...mailboxFields,
	...contactFields,
	...contactNoteFields,
	...uniboxFields,
	...pipelineFields,
	...dealFields,
	...crmTaskFields,
	...crmTaskTypeFields,
	...templateFields,
	...analyticsFields,
	...auditLogFields,
	...apiKeyFields,
	...integrationFields,
	...automationFields,
	...webhookFields,
	...warmupRoutingFields,
	...outreachFields,
	...deliverabilityFields,
	...deadLetterFields,
	...teamFields,
	...workspaceFields,
];
