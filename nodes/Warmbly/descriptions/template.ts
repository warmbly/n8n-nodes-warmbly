import type { INodeProperties } from 'n8n-workflow';

export const templateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'template',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a reply template',
				description: 'Create a reply template',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a reply template',
				description: 'Delete a reply template',
			},
			{
				name: 'Duplicate',
				value: 'duplicate',
				action: 'Duplicate a reply template',
				description: 'Duplicate a reply template',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a reply template',
				description: 'Get a reply template',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many reply templates',
				description: 'Get many reply templates',
			},
			{
				name: 'Render',
				value: 'render',
				action: 'Render a reply template',
				description: 'Render a reply template',
			},
			{
				name: 'Reorder',
				value: 'reorder',
				action: 'Reorder reply templates',
				description: 'Reorder reply templates',
			},
			{
				name: 'Score Content',
				value: 'score',
				action: 'Score template content',
				description: 'Score template content',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a reply template',
				description: 'Update a reply template',
			},
		],
		default: 'getAll',
	},
];

export const templateFields: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'template',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Q',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Optional case-insensitive search over name and subject.',
			},
		],
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Template name.',
		displayOptions: {
			show: {
				resource: [
					'template',
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
					'template',
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
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Subject line (may contain {{.Key}} placeholders).',
			},
		],
	},
	{
		displayName: 'IDs',
		name: 'ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Template IDs in their new order (1-indexed). IDs omitted are left untouched. Comma-separated list.',
		displayOptions: {
			show: {
				resource: [
					'template',
				],
				operation: [
					'reorder',
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
					'template',
				],
				operation: [
					'reorder',
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
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'template',
				],
				operation: [
					'score',
				],
			},
		},
		options: [
			{
				displayName: 'Body HTML',
				name: 'body_html',
				type: 'string',
				default: '',
				description: 'Used when body_plain is empty.',
			},
			{
				displayName: 'Body Plain',
				name: 'body_plain',
				type: 'string',
				default: '',
				description: 'Preferred over HTML when present.',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Template ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The template ID.',
		displayOptions: {
			show: {
				resource: [
					'template',
				],
				operation: [
					'get',
				],
			},
		},
	},
	{
		displayName: 'Template ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The template ID.',
		displayOptions: {
			show: {
				resource: [
					'template',
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
					'template',
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
		],
	},
	{
		displayName: 'Template ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The template ID.',
		displayOptions: {
			show: {
				resource: [
					'template',
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
					'template',
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
		displayName: 'Template ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The source template ID.',
		displayOptions: {
			show: {
				resource: [
					'template',
				],
				operation: [
					'duplicate',
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
					'template',
				],
				operation: [
					'duplicate',
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
		displayName: 'Template ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The template ID.',
		displayOptions: {
			show: {
				resource: [
					'template',
				],
				operation: [
					'render',
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
					'template',
				],
				operation: [
					'render',
				],
			},
		},
		options: [
			{
				displayName: 'Variables',
				name: 'variables',
				type: 'json',
				default: '',
				description: 'Values substituted into {{.Key}} placeholders.',
			},
		],
	},
];
