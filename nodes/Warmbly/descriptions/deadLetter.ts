import type { INodeProperties } from 'n8n-workflow';

export const deadLetterOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'deadLetter',
				],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many dead letters',
				description: 'Get many dead letters',
			},
			{
				name: 'Replay',
				value: 'replay',
				action: 'Replay a task dead letter',
				description: 'Replay a task dead letter',
			},
		],
		default: 'getAll',
	},
];

export const deadLetterFields: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'deadLetter',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				description: 'Optional status filter (e.g. pending, replayed).',
			},
		],
	},
	{
		displayName: 'Dead Letter ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The dead-letter record ID (the `id` field, not `task_id`).',
		displayOptions: {
			show: {
				resource: [
					'deadLetter',
				],
				operation: [
					'replay',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'deadLetter',
				],
				operation: [
					'replay',
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
