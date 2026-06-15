import type { INodeProperties } from 'n8n-workflow';

export const integrationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a connection',
				description: 'Create a connection',
			},
			{
				name: 'Create Event Subscription',
				value: 'createEventSubscription',
				action: 'Create an event subscription',
				description: 'Create an event subscription',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Disconnect',
				description: 'Disconnect',
			},
			{
				name: 'Delete Event Subscription',
				value: 'deleteEventSubscription',
				action: 'Delete an event subscription',
				description: 'Delete an event subscription',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a connection',
				description: 'Get a connection',
			},
			{
				name: 'Get Bookings',
				value: 'getBookings',
				action: 'List meeting bookings integrations view',
				description: 'List meeting bookings (integrations view)',
			},
			{
				name: 'Get Catalog',
				value: 'getCatalog',
				action: 'List the integration catalog',
				description: 'List the integration catalog',
			},
			{
				name: 'Get Event Subscriptions',
				value: 'getEventSubscriptions',
				action: 'List event subscriptions',
				description: 'List event subscriptions',
			},
			{
				name: 'Get Field Mappings',
				value: 'getFieldMappings',
				action: 'List field mappings',
				description: 'List field mappings',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many integration connections',
				description: 'Get many integration connections',
			},
			{
				name: 'Get Sync Runs',
				value: 'getSyncRuns',
				action: 'List sync runs',
				description: 'List sync runs',
			},
			{
				name: 'Get Webhook Secret',
				value: 'getWebhookSecret',
				action: 'Get the connection webhook secret',
				description: 'Get the connection webhook secret',
			},
			{
				name: 'Push Contacts',
				value: 'push',
				action: 'Push contacts to a CRM',
				description: 'Push contacts to a CRM',
			},
			{
				name: 'Replace Field Mappings',
				value: 'replaceFieldMappings',
				action: 'Replace field mappings',
			},
			{
				name: 'Test Connection',
				value: 'test',
				action: 'Test a connection',
				description: 'Test a connection',
			},
			{
				name: 'Update Config',
				value: 'updateConfig',
				action: 'Update connection config',
				description: 'Update connection config',
			},
		],
		default: 'getAll',
	},
];

export const integrationFields: INodeProperties[] = [
	{
		displayName: 'Provider',
		name: 'provider',
		type: 'string',
		default: '',
		required: true,
		description: 'A valid api_key/webhook provider id (e.g. close, discord). OAuth providers are rejected.',
		displayOptions: {
			show: {
				resource: [
					'integration',
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
					'integration',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Config',
				name: 'config',
				type: 'json',
				default: '',
				description: 'Provider-specific config (e.g. the pasted API key or webhook URL).',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Label',
				name: 'label',
				type: 'string',
				default: '',
				description: 'Friendly name shown on the connection card.',
			},
		],
	},
	{
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'get',
				],
			},
		},
	},
	{
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
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
					'integration',
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
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'updateConfig',
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
					'integration',
				],
				operation: [
					'updateConfig',
				],
			},
		},
		options: [
			{
				displayName: 'Config Capabilities',
				name: 'config_capabilities',
				type: 'json',
				default: '',
				description: 'Per-connection capability snapshot (picker selections, enabled use-cases).',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Sync Direction',
				name: 'sync_direction',
				type: 'options',
				options: [
					{
						name: 'Both',
						value: 'both',
					},
					{
						name: 'Pull',
						value: 'pull',
					},
					{
						name: 'Push',
						value: 'push',
					},
				],
				default: 'push',
			},
		],
	},
	{
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'getEventSubscriptions',
				],
			},
		},
	},
	{
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'createEventSubscription',
				],
			},
		},
	},
	{
		displayName: 'Event Type',
		name: 'event_type',
		type: 'string',
		default: '',
		required: true,
		description: 'The Warmbly event to react to (e.g. email.replied).',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'createEventSubscription',
				],
			},
		},
	},
	{
		displayName: 'Action',
		name: 'action',
		type: 'string',
		default: '',
		required: true,
		description: 'Provider action id (e.g. slack.notify, hubspot.upsert_contact).',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'createEventSubscription',
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
					'integration',
				],
				operation: [
					'createEventSubscription',
				],
			},
		},
		options: [
			{
				displayName: 'Config',
				name: 'config',
				type: 'json',
				default: '',
				description: 'Action config (e.g. a Slack channel or message template).',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: false,
				description: 'Defaults to true when omitted.',
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
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'deleteEventSubscription',
				],
			},
		},
	},
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		default: '',
		required: true,
		description: 'Event subscription id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'deleteEventSubscription',
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
					'integration',
				],
				operation: [
					'deleteEventSubscription',
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
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'getFieldMappings',
				],
			},
		},
	},
	{
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'replaceFieldMappings',
				],
			},
		},
	},
	{
		displayName: 'Mappings',
		name: 'mappings',
		type: 'json',
		default: '',
		required: true,
		description: 'The full set of mappings to store (replaces any existing).',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'replaceFieldMappings',
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
					'integration',
				],
				operation: [
					'replaceFieldMappings',
				],
			},
		},
		options: [
			{
				displayName: 'Object',
				name: 'object',
				type: 'string',
				default: '',
				description: 'The provider object the mappings apply to (e.g. contact).',
			},
		],
	},
	{
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'push',
				],
			},
		},
	},
	{
		displayName: 'Contact IDs',
		name: 'contact_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Contact ids to push. Deduplicated server-side. At least 1, at most 500. Comma-separated list.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'push',
				],
			},
		},
	},
	{
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'getSyncRuns',
				],
			},
		},
	},
	{
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'test',
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
					'integration',
				],
				operation: [
					'test',
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
		displayName: 'Connection ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Connection id.',
		displayOptions: {
			show: {
				resource: [
					'integration',
				],
				operation: [
					'getWebhookSecret',
				],
			},
		},
	},
];
