import type { INodeProperties } from 'n8n-workflow';

export const outreachOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'outreach',
				],
			},
		},
		options: [
			{
				name: 'Get Settings',
				value: 'get',
				action: 'Get outreach settings',
				description: 'Get outreach settings',
			},
			{
				name: 'Update Settings',
				value: 'update',
				action: 'Update outreach settings',
				description: 'Update outreach settings',
			},
		],
		default: 'get',
	},
];

export const outreachFields: INodeProperties[] = [
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'json',
		default: '',
		required: true,
		description: 'Advanced outreach overrides for a campaign.',
		displayOptions: {
			show: {
				resource: [
					'outreach',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'outreach',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
		],
	},
];
