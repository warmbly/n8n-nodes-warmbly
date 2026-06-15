import type { INodeProperties } from 'n8n-workflow';

export const pipelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create pipeline',
				description: 'Create pipeline',
			},
			{
				name: 'Create Stage',
				value: 'createStage',
				action: 'Create stage',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete pipeline',
				description: 'Delete pipeline',
			},
			{
				name: 'Delete Stage',
				value: 'deleteStage',
				action: 'Delete stage',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get pipeline',
				description: 'Get pipeline',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many pipelines',
				description: 'Get many pipelines',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update pipeline',
				description: 'Update pipeline',
			},
			{
				name: 'Update Stage',
				value: 'updateStage',
				action: 'Update stage',
			},
		],
		default: 'getAll',
	},
];

export const pipelineFields: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Pipeline name.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
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
					'pipeline',
				],
				operation: [
					'create',
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
			{
				displayName: 'Stages',
				name: 'stages',
				type: 'json',
				default: '',
				description: 'Stages to create with the pipeline, in order.',
			},
		],
	},
	{
		displayName: 'Pipeline ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Pipeline ID.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
				operation: [
					'get',
				],
			},
		},
	},
	{
		displayName: 'Pipeline ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Pipeline ID.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
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
					'pipeline',
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
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New pipeline name.',
			},
		],
	},
	{
		displayName: 'Pipeline ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Pipeline ID.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
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
					'pipeline',
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
		displayName: 'Pipeline ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Pipeline ID.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
				operation: [
					'createStage',
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
		description: 'Stage name.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
				operation: [
					'createStage',
				],
			},
		},
	},
	{
		displayName: 'Color',
		name: 'color',
		type: 'color',
		default: '',
		required: true,
		description: 'Stage color (hex).',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
				operation: [
					'createStage',
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
					'pipeline',
				],
				operation: [
					'createStage',
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
		displayName: 'Pipeline ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Pipeline ID.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
				operation: [
					'updateStage',
				],
			},
		},
	},
	{
		displayName: 'Stage ID',
		name: 'stageId',
		type: 'string',
		default: '',
		required: true,
		description: 'Stage ID.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
				operation: [
					'updateStage',
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
					'pipeline',
				],
				operation: [
					'updateStage',
				],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'New stage color (hex).',
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
				description: 'New stage name.',
			},
		],
	},
	{
		displayName: 'Pipeline ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Pipeline ID.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
				operation: [
					'deleteStage',
				],
			},
		},
	},
	{
		displayName: 'Stage ID',
		name: 'stageId',
		type: 'string',
		default: '',
		required: true,
		description: 'Stage ID.',
		displayOptions: {
			show: {
				resource: [
					'pipeline',
				],
				operation: [
					'deleteStage',
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
					'pipeline',
				],
				operation: [
					'deleteStage',
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
