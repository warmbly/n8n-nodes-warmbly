import type { INodeProperties } from 'n8n-workflow';

export const workspaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'workspace',
				],
			},
		},
		options: [
			{
				name: 'Get Plans',
				value: 'getPlans',
				action: 'List plans',
				description: 'List plans',
			},
			{
				name: 'Get Timezones',
				value: 'getTimezones',
				action: 'List timezones',
				description: 'List timezones',
			},
		],
		default: 'getPlans',
	},
];

export const workspaceFields: INodeProperties[] = [];
