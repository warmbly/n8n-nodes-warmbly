import type { INodeProperties } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'team',
				],
			},
		},
		options: [
			{
				name: 'Add Member',
				value: 'addMember',
				action: 'Add a team member',
				description: 'Add a team member',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a team',
				description: 'Create a team',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a team',
				description: 'Delete a team',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a team',
				description: 'Get a team',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many teams',
				description: 'Get many teams',
			},
			{
				name: 'Remove Member',
				value: 'removeMember',
				action: 'Remove a team member',
				description: 'Remove a team member',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a team',
				description: 'Update a team',
			},
		],
		default: 'getAll',
	},
];

export const teamFields: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'team',
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
					'team',
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
				type: 'string',
				default: '',
				description: 'Hex color (defaults to #94a3b8).',
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
		displayName: 'Team ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The team id.',
		displayOptions: {
			show: {
				resource: [
					'team',
				],
				operation: [
					'get',
				],
			},
		},
	},
	{
		displayName: 'Team ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The team id.',
		displayOptions: {
			show: {
				resource: [
					'team',
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
					'team',
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
				type: 'string',
				default: '',
				description: 'Hex color.',
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
			},
		],
	},
	{
		displayName: 'Team ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The team id.',
		displayOptions: {
			show: {
				resource: [
					'team',
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
					'team',
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
	{
		displayName: 'Team ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The team id.',
		displayOptions: {
			show: {
				resource: [
					'team',
				],
				operation: [
					'addMember',
				],
			},
		},
	},
	{
		displayName: 'User ID',
		name: 'user_id',
		type: 'string',
		default: '',
		required: true,
		description: 'The member\'s user id (must already belong to the organization).',
		displayOptions: {
			show: {
				resource: [
					'team',
				],
				operation: [
					'addMember',
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
					'team',
				],
				operation: [
					'addMember',
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
	{
		displayName: 'Team ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The team id.',
		displayOptions: {
			show: {
				resource: [
					'team',
				],
				operation: [
					'removeMember',
				],
			},
		},
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		required: true,
		description: 'The member\'s user id.',
		displayOptions: {
			show: {
				resource: [
					'team',
				],
				operation: [
					'removeMember',
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
					'team',
				],
				operation: [
					'removeMember',
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
