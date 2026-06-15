import type { INodeProperties } from 'n8n-workflow';

export const campaignVariantOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'campaignVariant',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an A/B variant',
				description: 'Create an A/B variant',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an A/B variant',
				description: 'Delete an A/B variant',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many campaign A/B variants',
				description: 'Get many campaign A/B variants',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an A/B variant',
				description: 'Update an A/B variant',
			},
		],
		default: 'getAll',
	},
];

export const campaignVariantFields: INodeProperties[] = [
	{
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignVariant',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignVariant',
				],
				operation: [
					'create',
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
		displayOptions: {
			show: {
				resource: [
					'campaignVariant',
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
					'campaignVariant',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Body HTML',
				name: 'body_html',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Body Plain',
				name: 'body_plain',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Is Control',
				name: 'is_control',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '',
				description: 'Provide as JSON.',
			},
			{
				displayName: 'Step ID',
				name: 'step_id',
				type: 'string',
				default: '',
				description: 'Step to scope the variant to; omit for campaign-level.',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				default: 0,
			},
		],
	},
	{
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignVariant',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignVariant',
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
					'campaignVariant',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Body HTML',
				name: 'body_html',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Body Plain',
				name: 'body_plain',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Is Control',
				name: 'is_control',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '',
				description: 'Provide as JSON.',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				default: 0,
			},
		],
	},
	{
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignVariant',
				],
				operation: [
					'delete',
				],
			},
		},
	},
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignVariant',
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
					'campaignVariant',
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
