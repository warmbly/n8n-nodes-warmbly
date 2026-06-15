import type { INodeProperties } from 'n8n-workflow';

export const warmupRoutingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a warmup routing rule',
				description: 'Create a warmup routing rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a warmup routing rule',
				description: 'Delete a warmup routing rule',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many warmup routing rules',
				description: 'Get many warmup routing rules',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a warmup routing rule',
				description: 'Update a warmup routing rule',
			},
		],
		default: 'getAll',
	},
];

export const warmupRoutingFields: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Display name for the rule.',
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Sender Match Type',
		name: 'sender_match_type',
		type: 'options',
		options: [
			{
				name: 'Any',
				value: 'any',
			},
			{
				name: 'Domain',
				value: 'domain',
			},
			{
				name: 'Provider',
				value: 'provider',
			},
			{
				name: 'Tld',
				value: 'tld',
			},
		],
		default: 'any',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Recipient Match Type',
		name: 'recipient_match_type',
		type: 'options',
		options: [
			{
				name: 'Any',
				value: 'any',
			},
			{
				name: 'Domain',
				value: 'domain',
			},
			{
				name: 'Provider',
				value: 'provider',
			},
			{
				name: 'Tld',
				value: 'tld',
			},
		],
		default: 'any',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
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
					'warmupRouting',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: false,
				description: 'Whether the rule is active.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 0,
				description: 'Evaluation order, ascending. Lower runs first.',
			},
			{
				displayName: 'Recipient Match Value',
				name: 'recipient_match_value',
				type: 'string',
				default: '',
				description: 'Required unless recipient_match_type is any. Same value forms as the sender side.',
			},
			{
				displayName: 'Sender Match Value',
				name: 'sender_match_value',
				type: 'string',
				default: '',
				description: 'Required unless sender_match_type is any. Domain (acme.com), TLD (com), or provider bucket (google, microsoft, yahoo, apple, proton, zoho, custom).',
			},
			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				default: 0,
				description: 'Selection weight, must be >= 0.',
			},
		],
	},
	{
		displayName: 'Routing Rule ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The rule ID.',
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Display name for the rule.',
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Sender Match Type',
		name: 'sender_match_type',
		type: 'options',
		options: [
			{
				name: 'Any',
				value: 'any',
			},
			{
				name: 'Domain',
				value: 'domain',
			},
			{
				name: 'Provider',
				value: 'provider',
			},
			{
				name: 'Tld',
				value: 'tld',
			},
		],
		default: 'any',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Recipient Match Type',
		name: 'recipient_match_type',
		type: 'options',
		options: [
			{
				name: 'Any',
				value: 'any',
			},
			{
				name: 'Domain',
				value: 'domain',
			},
			{
				name: 'Provider',
				value: 'provider',
			},
			{
				name: 'Tld',
				value: 'tld',
			},
		],
		default: 'any',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
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
					'warmupRouting',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: false,
				description: 'Whether the rule is active.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 0,
				description: 'Evaluation order, ascending. Lower runs first.',
			},
			{
				displayName: 'Recipient Match Value',
				name: 'recipient_match_value',
				type: 'string',
				default: '',
				description: 'Required unless recipient_match_type is any. Same value forms as the sender side.',
			},
			{
				displayName: 'Sender Match Value',
				name: 'sender_match_value',
				type: 'string',
				default: '',
				description: 'Required unless sender_match_type is any. Domain (acme.com), TLD (com), or provider bucket (google, microsoft, yahoo, apple, proton, zoho, custom).',
			},
			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				default: 0,
				description: 'Selection weight, must be >= 0.',
			},
		],
	},
	{
		displayName: 'Routing Rule ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The rule ID.',
		displayOptions: {
			show: {
				resource: [
					'warmupRouting',
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
					'warmupRouting',
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
