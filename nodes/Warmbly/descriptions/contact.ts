import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
			},
		},
		options: [
			{
				name: 'Bulk Delete',
				value: 'bulkDelete',
				action: 'Bulk delete contacts',
				description: 'Bulk delete contacts',
			},
			{
				name: 'Bulk Update',
				value: 'bulkUpdate',
				action: 'Bulk update contacts',
				description: 'Bulk update contacts',
			},
			{
				name: 'Commit Import',
				value: 'importCommit',
				action: 'Commit an import',
				description: 'Commit an import',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create contacts',
				description: 'Create contacts',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a contact',
				description: 'Delete a contact',
			},
			{
				name: 'Export',
				value: 'export',
				action: 'Export contacts',
				description: 'Export contacts',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a contact',
				description: 'Get a contact',
			},
			{
				name: 'Get Activities',
				value: 'getActivities',
				action: 'List a contact s activities',
				description: 'List a contact\'s activities',
			},
			{
				name: 'Get Deals',
				value: 'getDeals',
				action: 'List a contact s deals',
				description: 'List a contact\'s deals',
			},
			{
				name: 'Get Emails',
				value: 'getEmails',
				action: 'List emails sent to a contact',
				description: 'List emails sent to a contact',
			},
			{
				name: 'Get Timeline',
				value: 'getTimeline',
				action: 'List a contact s timeline',
				description: 'List a contact\'s timeline',
			},
			{
				name: 'Look Up by Email',
				value: 'lookup',
				action: 'Look up a contact by email',
				description: 'Look up a contact by email',
			},
			{
				name: 'Preview Import',
				value: 'importPreview',
				action: 'Preview an import',
				description: 'Preview an import',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search contacts',
				description: 'Search contacts',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a contact',
				description: 'Update a contact',
			},
		],
		default: 'bulkDelete',
	},
];

export const contactFields: INodeProperties[] = [
	{
		displayName: 'Contacts',
		name: 'contacts',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of contact objects to create. Each object accepts: email (required), first_name, last_name, company, phone, custom_fields, campaigns, categories.',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'create',
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
					'contact',
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
		],
	},
	{
		displayName: 'Contacts',
		name: 'contacts',
		type: 'string',
		default: '',
		required: true,
		description: 'Contact IDs to edit (1 to 1000). Comma-separated list.',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'bulkUpdate',
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
					'contact',
				],
				operation: [
					'bulkUpdate',
				],
			},
		},
		options: [
			{
				displayName: 'Add Campaigns',
				name: 'add_campaigns',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Add Categories',
				name: 'add_categories',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'json',
				default: '',
				description: 'Provide as JSON.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Remove Campaigns',
				name: 'remove_campaigns',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Remove Categories',
				name: 'remove_categories',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Subscribe',
				name: 'subscribe',
				type: 'boolean',
				default: false,
				description: 'Set subscription status for all listed contacts.',
			},
		],
	},
	{
		displayName: 'Contact IDs',
		name: 'contact_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of contact IDs to delete (1 to 1000).',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'bulkDelete',
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
					'contact',
				],
				operation: [
					'bulkDelete',
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
		displayName: 'Format',
		name: 'format',
		type: 'options',
		options: [
			{
				name: 'CSV',
				value: 'csv',
			},
			{
				name: 'JSON',
				value: 'json',
			},
			{
				name: 'Xlsx',
				value: 'xlsx',
			},
		],
		default: 'csv',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'export',
				],
			},
		},
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		options: [
			{
				name: 'All',
				value: 'all',
			},
			{
				name: 'Filtered',
				value: 'filtered',
			},
			{
				name: 'Selected',
				value: 'selected',
			},
		],
		default: 'all',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'export',
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
					'contact',
				],
				operation: [
					'export',
				],
			},
		},
		options: [
			{
				displayName: 'Contact IDs',
				name: 'contact_ids',
				type: 'string',
				default: '',
				description: 'Contact IDs when scope is selected. Comma-separated list.',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				default: '',
				description: 'Column identifiers in display order (built-ins like email, first_name, or custom:<key>). Empty uses defaults. Comma-separated list.',
			},
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				default: '',
				description: 'Filename without extension. Sanitized server-side; empty falls back to contacts-<YYYY-MM-DD>.',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'string',
				default: '',
				description: 'A search filter body when scope is filtered.',
			},
		],
	},
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property that contains the file to upload.',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'importCommit',
				],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'string',
		default: '',
		required: true,
		description: 'JSON-encoded ContactImportCommitOptions as a string.',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'importCommit',
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
					'contact',
				],
				operation: [
					'importCommit',
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
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property that contains the file to upload.',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'importPreview',
				],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		required: true,
		description: 'The email address to resolve.',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'lookup',
				],
			},
		},
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
					'contact',
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
					'contact',
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
					'contact',
				],
				operation: [
					'search',
				],
			},
		},
		options: [
			{
				displayName: 'Campaign IDs',
				name: 'campaign_ids',
				type: 'string',
				default: '',
				description: 'Contact must be in ALL of these campaigns. Comma-separated list.',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Convenience filter for a single category ID.',
			},
			{
				displayName: 'Category IDs',
				name: 'category_ids',
				type: 'string',
				default: '',
				description: 'Contact must have ALL of these categories. Comma-separated list.',
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
				displayName: 'Custom Field Filters',
				name: 'custom_field_filters',
				type: 'json',
				default: '',
				description: 'Provide as JSON.',
			},
			{
				displayName: 'Max Campaigns',
				name: 'max_campaigns',
				type: 'number',
				default: 0,
				description: 'Maximum number of associated campaigns.',
			},
			{
				displayName: 'Min Campaigns',
				name: 'min_campaigns',
				type: 'number',
				default: 0,
				description: 'Minimum number of associated campaigns.',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Text search across name, email, company.',
			},
			{
				displayName: 'Reverse',
				name: 'reverse',
				type: 'boolean',
				default: false,
				description: 'Descending when true.',
			},
			{
				displayName: 'Sort By',
				name: 'sort_by',
				type: 'string',
				default: '',
				description: 'Sort column, e.g. first_name, campaign_count.',
			},
			{
				displayName: 'Subscribed',
				name: 'subscribed',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Updated After',
				name: 'updated_after',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Updated Before',
				name: 'updated_before',
				type: 'dateTime',
				default: '',
			},
		],
	},
	{
		displayName: 'Contact ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'get',
				],
			},
		},
	},
	{
		displayName: 'Contact ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
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
					'contact',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Add Categories',
				name: 'add_categories',
				type: 'string',
				default: '',
				description: 'Diff-style add (ignored when categories is set). Comma-separated list.',
			},
			{
				displayName: 'Campaigns',
				name: 'campaigns',
				type: 'string',
				default: '',
				description: 'Set the full campaign membership (omit to leave as-is). Comma-separated list.',
			},
			{
				displayName: 'Categories',
				name: 'categories',
				type: 'string',
				default: '',
				description: 'Set the full category list (omit to leave as-is). Comma-separated list.',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'json',
				default: '',
				description: 'Replaces the custom-fields map.',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
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
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Remove Categories',
				name: 'remove_categories',
				type: 'string',
				default: '',
				description: 'Diff-style remove (ignored when categories is set). Comma-separated list.',
			},
			{
				displayName: 'Subscribed',
				name: 'subscribed',
				type: 'boolean',
				default: false,
			},
		],
	},
	{
		displayName: 'Contact ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
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
					'contact',
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
		displayName: 'Contact ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'getActivities',
				],
			},
		},
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
					'contact',
				],
				operation: [
					'getActivities',
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
					'contact',
				],
				operation: [
					'getActivities',
				],
				returnAll: [
					false,
				],
			},
		},
	},
	{
		displayName: 'Contact ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'getDeals',
				],
			},
		},
	},
	{
		displayName: 'Contact ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'getEmails',
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
					'contact',
				],
				operation: [
					'getEmails',
				],
			},
		},
		options: [
			{
				displayName: 'Before At',
				name: 'before_at',
				type: 'dateTime',
				default: '',
				description: 'created_at of the last row from the previous page (RFC 3339 nano).',
			},
			{
				displayName: 'Before ID',
				name: 'before_id',
				type: 'string',
				default: '',
				description: 'task_id of the last row from the previous page.',
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
			},
		],
	},
	{
		displayName: 'Contact ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
				operation: [
					'getTimeline',
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
					'contact',
				],
				operation: [
					'getTimeline',
				],
			},
		},
		options: [
			{
				displayName: 'Before',
				name: 'before',
				type: 'dateTime',
				default: '',
				description: 'The `at` timestamp of the oldest event from the previous page (RFC 3339 nano).',
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
			},
		],
	},
];
