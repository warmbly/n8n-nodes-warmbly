import type { INodeProperties } from 'n8n-workflow';

export const crmTaskTypeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'crmTaskType',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create task type',
				description: 'Create task type',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete task type',
				description: 'Delete task type',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many CRM task types',
				description: 'Get many CRM task types',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update task type',
				description: 'Update task type',
			},
		],
		default: 'getAll',
	},
];

export const crmTaskTypeFields: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Type name.',
		displayOptions: {
			show: {
				resource: [
					'crmTaskType',
				],
				operation: [
					'create',
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
					'crmTaskType',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Type color (hex).',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
		],
	},
	{
		displayName: 'Task Type ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Task type ID.',
		displayOptions: {
			show: {
				resource: [
					'crmTaskType',
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
					'crmTaskType',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'New type color (hex).',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New type name.',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'New ordering position.',
			},
		],
	},
	{
		displayName: 'Task Type ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Task type ID.',
		displayOptions: {
			show: {
				resource: [
					'crmTaskType',
				],
				operation: [
					'delete',
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
					'crmTaskType',
				],
				operation: [
					'delete',
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
