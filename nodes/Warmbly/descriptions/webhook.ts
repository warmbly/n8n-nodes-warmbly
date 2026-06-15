import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'webhook',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a webhook endpoint',
				description: 'Create a webhook endpoint',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a webhook endpoint',
				description: 'Delete a webhook endpoint',
			},
			{
				name: 'Get Deliveries',
				value: 'getDeliveries',
				action: 'List delivery attempts',
				description: 'List delivery attempts',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many webhook endpoints',
				description: 'Get many webhook endpoints',
			},
			{
				name: 'Rotate Secret',
				value: 'rotateSecret',
				action: 'Rotate the signing secret',
				description: 'Rotate the signing secret',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a webhook endpoint',
				description: 'Update a webhook endpoint',
			},
		],
		default: 'getAll',
	},
];

export const webhookFields: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		description: 'HTTPS URL that will receive POST callbacks. Must be publicly routable.',
		displayOptions: {
			show: {
				resource: [
					'webhook',
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
					'webhook',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Free-text label for your own reference.',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the endpoint is active. Defaults to true.',
			},
			{
				displayName: 'Event Types',
				name: 'event_types',
				type: 'json',
				default: '',
				description: 'Event names to subscribe to. Each must be a known type. An empty or omitted array subscribes to all events. On update this overwrites the existing filter (not merged).',
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
		displayName: 'Webhook ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The endpoint id to update.',
		displayOptions: {
			show: {
				resource: [
					'webhook',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		description: 'HTTPS URL that will receive POST callbacks. Must be publicly routable.',
		displayOptions: {
			show: {
				resource: [
					'webhook',
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
					'webhook',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Free-text label for your own reference.',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the endpoint is active. Defaults to true.',
			},
			{
				displayName: 'Event Types',
				name: 'event_types',
				type: 'json',
				default: '',
				description: 'Event names to subscribe to. Each must be a known type. An empty or omitted array subscribes to all events. On update this overwrites the existing filter (not merged).',
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
		displayName: 'Webhook ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The endpoint id to delete.',
		displayOptions: {
			show: {
				resource: [
					'webhook',
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
					'webhook',
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
		displayName: 'Webhook ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The endpoint id whose deliveries to list.',
		displayOptions: {
			show: {
				resource: [
					'webhook',
				],
				operation: [
					'getDeliveries',
				],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'webhook',
				],
				operation: [
					'getDeliveries',
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
		],
	},
	{
		displayName: 'Webhook ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The endpoint id to rotate.',
		displayOptions: {
			show: {
				resource: [
					'webhook',
				],
				operation: [
					'rotateSecret',
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
					'webhook',
				],
				operation: [
					'rotateSecret',
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
