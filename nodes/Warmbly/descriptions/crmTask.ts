import type { INodeProperties } from 'n8n-workflow';

export const crmTaskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'crmTask',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create task',
				description: 'Create task',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete task',
				description: 'Delete task',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get task',
				description: 'Get task',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many CRM tasks',
				description: 'Get many CRM tasks',
			},
			{
				name: 'Get Summary',
				value: 'summary',
				action: 'Tasks summary',
				description: 'Tasks summary',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search tasks',
				description: 'Search tasks',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update task',
				description: 'Update task',
			},
		],
		default: 'getAll',
	},
];

export const crmTaskFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'crmTask',
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
					'crmTask',
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
					'crmTask',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'string',
				default: '',
				description: 'Restrict to tasks assigned to this user.',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Restrict to tasks linked to this contact.',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'Restrict to tasks linked to this deal.',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Cancelled',
						value: 'cancelled',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'In Progress',
						value: 'in_progress',
					},
					{
						name: 'Pending',
						value: 'pending',
					},
				],
				default: 'pending',
				description: 'Restrict to a task status.',
			},
		],
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		description: 'Task title.',
		displayOptions: {
			show: {
				resource: [
					'crmTask',
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
					'crmTask',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned Team ID',
				name: 'assigned_team_id',
				type: 'string',
				default: '',
				description: 'Assignee team ID.',
			},
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'string',
				default: '',
				description: 'Assignee user ID.',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Linked contact.',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'Linked deal.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Free-text description.',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
				description: 'Due date.',
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
				type: 'options',
				options: [
					{
						name: 'High',
						value: 'high',
					},
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'Urgent',
						value: 'urgent',
					},
				],
				default: 'low',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Task type name (matches a configured task type).',
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
					'crmTask',
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
					'crmTask',
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
					'crmTask',
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
				description: 'Assignee user ID is any of these. Comma-separated list.',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Linked contact.',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'Linked deal.',
			},
			{
				displayName: 'Due After',
				name: 'due_after',
				type: 'dateTime',
				default: '',
				description: 'Due on or after.',
			},
			{
				displayName: 'Due Before',
				name: 'due_before',
				type: 'dateTime',
				default: '',
				description: 'Due on or before.',
			},
			{
				displayName: 'Overdue',
				name: 'overdue',
				type: 'boolean',
				default: false,
				description: 'Only tasks past due and not completed or cancelled.',
			},
			{
				displayName: 'Priorities',
				name: 'priorities',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Case-insensitive match on task title.',
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
						name: 'Due Date',
						value: 'due_date',
					},
					{
						name: 'Priority',
						value: 'priority',
					},
					{
						name: 'Title',
						value: 'title',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
					},
				],
				default: 'created_at',
			},
			{
				displayName: 'Statuses',
				name: 'statuses',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Team IDs',
				name: 'team_ids',
				type: 'string',
				default: '',
				description: 'Task team is any of these, or the assignee belongs to one. Comma-separated list.',
			},
			{
				displayName: 'Types',
				name: 'types',
				type: 'string',
				default: '',
				description: 'Task type name is any of these. Comma-separated list.',
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
					'crmTask',
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
				description: 'Assignee user ID is any of these. Comma-separated list.',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Linked contact.',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'Linked deal.',
			},
			{
				displayName: 'Due After',
				name: 'due_after',
				type: 'dateTime',
				default: '',
				description: 'Due on or after.',
			},
			{
				displayName: 'Due Before',
				name: 'due_before',
				type: 'dateTime',
				default: '',
				description: 'Due on or before.',
			},
			{
				displayName: 'Overdue',
				name: 'overdue',
				type: 'boolean',
				default: false,
				description: 'Only tasks past due and not completed or cancelled.',
			},
			{
				displayName: 'Priorities',
				name: 'priorities',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Case-insensitive match on task title.',
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
						name: 'Due Date',
						value: 'due_date',
					},
					{
						name: 'Priority',
						value: 'priority',
					},
					{
						name: 'Title',
						value: 'title',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
					},
				],
				default: 'created_at',
			},
			{
				displayName: 'Statuses',
				name: 'statuses',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Team IDs',
				name: 'team_ids',
				type: 'string',
				default: '',
				description: 'Task team is any of these, or the assignee belongs to one. Comma-separated list.',
			},
			{
				displayName: 'Types',
				name: 'types',
				type: 'string',
				default: '',
				description: 'Task type name is any of these. Comma-separated list.',
			},
		],
	},
	{
		displayName: 'CRM Task ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Task ID.',
		displayOptions: {
			show: {
				resource: [
					'crmTask',
				],
				operation: [
					'get',
				],
			},
		},
	},
	{
		displayName: 'CRM Task ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Task ID.',
		displayOptions: {
			show: {
				resource: [
					'crmTask',
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
					'crmTask',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned Team ID',
				name: 'assigned_team_id',
				type: 'string',
				default: '',
				description: 'Assignee team ID.',
			},
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'string',
				default: '',
				description: 'Assignee user ID.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Free-text description.',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
				description: 'Due date.',
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
				type: 'options',
				options: [
					{
						name: 'High',
						value: 'high',
					},
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'Urgent',
						value: 'urgent',
					},
				],
				default: 'low',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Cancelled',
						value: 'cancelled',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'In Progress',
						value: 'in_progress',
					},
					{
						name: 'Pending',
						value: 'pending',
					},
				],
				default: 'pending',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Task title.',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Task type name.',
			},
		],
	},
	{
		displayName: 'CRM Task ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'Task ID.',
		displayOptions: {
			show: {
				resource: [
					'crmTask',
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
					'crmTask',
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
