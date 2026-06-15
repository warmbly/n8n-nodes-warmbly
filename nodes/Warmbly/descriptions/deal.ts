import type { INodeProperties } from 'n8n-workflow';

export const dealOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'deal',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create deal',
				description: 'Create deal',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete deal',
				description: 'Delete deal',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get deal',
				description: 'Get deal',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many deals',
				description: 'Get many deals',
			},
			{
				name: 'Get Summary',
				value: 'summary',
				action: 'Deals summary',
				description: 'Deals summary',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search deals',
				description: 'Search deals',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update deal',
				description: 'Update deal',
			},
		],
		default: 'getAll',
	},
];

export const dealFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'deal',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: [
					'deal',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
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
					'deal',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Pipeline ID',
				name: 'pipeline_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPipelines',
				},
				default: '',
				description: 'Restrict to deals in this pipeline.',
			},
			{
				displayName: 'Stage ID',
				name: 'stage_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPipelineStages',
					loadOptionsDependsOn: [
						'pipeline_id',
					],
				},
				default: '',
				description: 'Restrict to deals in this stage.',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Lost',
						value: 'lost',
					},
					{
						name: 'Open',
						value: 'open',
					},
					{
						name: 'Won',
						value: 'won',
					},
				],
				default: 'open',
				description: 'Restrict to a deal status.',
			},
		],
	},
	{
		displayName: 'Pipeline ID',
		name: 'pipeline_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		default: '',
		required: true,
		description: 'Pipeline the deal belongs to.',
		displayOptions: {
			show: {
				resource: [
					'deal',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Stage ID',
		name: 'stage_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelineStages',
			loadOptionsDependsOn: [
				'pipeline_id',
			],
		},
		default: '',
		required: true,
		description: 'Initial stage.',
		displayOptions: {
			show: {
				resource: [
					'deal',
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
		description: 'Deal name.',
		displayOptions: {
			show: {
				resource: [
					'deal',
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
					'deal',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'string',
				default: '',
				description: 'Owner (org member user ID).',
			},
			{
				displayName: 'Campaign ID',
				name: 'campaign_id',
				type: 'string',
				default: '',
				description: 'Attributed campaign.',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Linked contact.',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'ISO currency code.',
			},
			{
				displayName: 'Expected Close Date',
				name: 'expected_close_date',
				type: 'dateTime',
				default: '',
				description: 'Expected close date.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Source Mailbox ID',
				name: 'source_mailbox_id',
				type: 'string',
				default: '',
				description: 'Sending mailbox that produced the originating reply.',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'number',
				default: 0,
				description: 'Monetary value.',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'deal',
				],
				operation: [
					'search',
				],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: [
					'deal',
				],
				operation: [
					'search',
				],
				returnAll: [
					false,
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
					'deal',
				],
				operation: [
					'search',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'string',
				default: '',
				description: 'Owner is any of these user IDs. Comma-separated list.',
			},
			{
				displayName: 'Campaign IDs',
				name: 'campaign_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Close After',
				name: 'close_after',
				type: 'dateTime',
				default: '',
				description: 'Expected close date on or after.',
			},
			{
				displayName: 'Close Before',
				name: 'close_before',
				type: 'dateTime',
				default: '',
				description: 'Expected close date on or before.',
			},
			{
				displayName: 'Created After',
				name: 'created_after',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Created Before',
				name: 'created_before',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Max Value',
				name: 'max_value',
				type: 'number',
				default: 0,
				description: 'Value less than or equal to.',
			},
			{
				displayName: 'Min Value',
				name: 'min_value',
				type: 'number',
				default: 0,
				description: 'Value greater than or equal to.',
			},
			{
				displayName: 'Pipeline IDs',
				name: 'pipeline_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Case-insensitive match on deal name.',
			},
			{
				displayName: 'Reverse',
				name: 'reverse',
				type: 'boolean',
				default: false,
				description: 'true sorts ascending, false (default) descending.',
			},
			{
				displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				options: [
					{
						name: 'Created At',
						value: 'created_at',
					},
					{
						name: 'Expected Close Date',
						value: 'expected_close_date',
					},
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
					},
					{
						name: 'Value',
						value: 'value',
					},
				],
				default: 'created_at',
			},
			{
				displayName: 'Stage IDs',
				name: 'stage_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Statuses',
				name: 'statuses',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
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
					'deal',
				],
				operation: [
					'summary',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'string',
				default: '',
				description: 'Owner is any of these user IDs. Comma-separated list.',
			},
			{
				displayName: 'Campaign IDs',
				name: 'campaign_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Close After',
				name: 'close_after',
				type: 'dateTime',
				default: '',
				description: 'Expected close date on or after.',
			},
			{
				displayName: 'Close Before',
				name: 'close_before',
				type: 'dateTime',
				default: '',
				description: 'Expected close date on or before.',
			},
			{
				displayName: 'Created After',
				name: 'created_after',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Created Before',
				name: 'created_before',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Max Value',
				name: 'max_value',
				type: 'number',
				default: 0,
				description: 'Value less than or equal to.',
			},
			{
				displayName: 'Min Value',
				name: 'min_value',
				type: 'number',
				default: 0,
				description: 'Value greater than or equal to.',
			},
			{
				displayName: 'Pipeline IDs',
				name: 'pipeline_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Case-insensitive match on deal name.',
			},
			{
				displayName: 'Reverse',
				name: 'reverse',
				type: 'boolean',
				default: false,
				description: 'true sorts ascending, false (default) descending.',
			},
			{
				displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				options: [
					{
						name: 'Created At',
						value: 'created_at',
					},
					{
						name: 'Expected Close Date',
						value: 'expected_close_date',
					},
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
					},
					{
						name: 'Value',
						value: 'value',
					},
				],
				default: 'created_at',
			},
			{
				displayName: 'Stage IDs',
				name: 'stage_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Statuses',
				name: 'statuses',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
		],
	},
	{
		displayName: 'Deal ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Deal ID.',
		displayOptions: {
			show: {
				resource: [
					'deal',
				],
				operation: [
					'get',
				],
			},
		},
	},
	{
		displayName: 'Deal ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Deal ID.',
		displayOptions: {
			show: {
				resource: [
					'deal',
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
					'deal',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'string',
				default: '',
				description: 'Owner (org member user ID).',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Linked contact.',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'ISO currency code.',
			},
			{
				displayName: 'Expected Close Date',
				name: 'expected_close_date',
				type: 'dateTime',
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
				displayName: 'Lost Reason',
				name: 'lost_reason',
				type: 'string',
				default: '',
				description: 'Reason recorded when marking lost.',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Deal name.',
			},
			{
				displayName: 'Stage ID',
				name: 'stage_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPipelineStages',
					loadOptionsDependsOn: [
						'pipeline_id',
					],
				},
				default: '',
				description: 'Move the deal to this stage.',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Lost',
						value: 'lost',
					},
					{
						name: 'Open',
						value: 'open',
					},
					{
						name: 'Won',
						value: 'won',
					},
				],
				default: 'open',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'number',
				default: 0,
				description: 'Monetary value.',
			},
		],
	},
	{
		displayName: 'Deal ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Deal ID.',
		displayOptions: {
			show: {
				resource: [
					'deal',
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
					'deal',
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
