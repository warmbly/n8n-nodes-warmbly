import type { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a campaign',
				description: 'Create a campaign',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a campaign',
				description: 'Delete a campaign',
			},
			{
				name: 'Delete Attachment',
				value: 'deleteAttachment',
				action: 'Delete an attachment',
				description: 'Delete an attachment',
			},
			{
				name: 'Generate Writing',
				value: 'generateWriting',
				action: 'Generate copy with the writing assistant',
				description: 'Generate copy with the writing assistant',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a campaign',
				description: 'Get a campaign',
			},
			{
				name: 'Get A/B Analysis',
				value: 'getAbAnalysis',
				action: 'Get A/B analysis',
				description: 'Get A/B analysis',
			},
			{
				name: 'Get Advanced Settings',
				value: 'getAdvanced',
				action: 'Get advanced settings',
				description: 'Get advanced settings',
			},
			{
				name: 'Get Attachments',
				value: 'getAttachments',
				action: 'List attachments',
				description: 'List attachments',
			},
			{
				name: 'Get Logs',
				value: 'getLogs',
				action: 'Get campaign logs',
				description: 'Get campaign logs',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many campaigns',
				description: 'Get many campaigns',
			},
			{
				name: 'Get Senders',
				value: 'getSenders',
				action: 'List campaign senders',
				description: 'List campaign senders',
			},
			{
				name: 'Preview Template',
				value: 'previewTemplate',
				action: 'Preview a template',
				description: 'Preview a template',
			},
			{
				name: 'Replace Senders',
				value: 'replaceSenders',
				action: 'Replace senders',
				description: 'Replace senders',
			},
			{
				name: 'Run Preflight',
				value: 'preflight',
				action: 'Run preflight',
				description: 'Run preflight',
			},
			{
				name: 'Send Test Email',
				value: 'sendTestEmail',
				action: 'Send a test email',
				description: 'Send a test email',
			},
			{
				name: 'Start',
				value: 'start',
				action: 'Start a campaign',
				description: 'Start a campaign',
			},
			{
				name: 'Stop',
				value: 'stop',
				action: 'Stop a campaign',
				description: 'Stop a campaign',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a campaign',
				description: 'Update a campaign',
			},
			{
				name: 'Update Advanced Settings',
				value: 'updateAdvanced',
				action: 'Update advanced settings',
				description: 'Update advanced settings',
			},
			{
				name: 'Upload Attachment',
				value: 'uploadAttachment',
				action: 'Upload an attachment',
				description: 'Upload an attachment',
			},
			{
				name: 'Verify Tracking Domain',
				value: 'verifyTrackingDomain',
				action: 'Verify campaign tracking domain',
				description: 'Verify campaign tracking domain',
			},
		],
		default: 'getAll',
	},
];

export const campaignFields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'previewTemplate',
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
				displayName: 'Contact',
				name: 'contact',
				type: 'json',
				default: '',
				description: 'Override fields on the built-in sample contact.',
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
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'campaign',
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
					'campaign',
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
					'campaign',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Folder',
				name: 'folder',
				type: 'string',
				default: '',
				description: 'Restrict to a single folder id.',
			},
			{
				displayName: 'Q',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Free-text filter on campaign name.',
			},
		],
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
					'campaign',
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
					'campaign',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Advanced Overrides',
				name: 'advanced_overrides',
				type: 'json',
				default: '',
				description: 'Advanced outreach overrides for a campaign.',
			},
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'CC',
				name: 'cc',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Daily Limit',
				name: 'daily_limit',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Days',
				name: 'days',
				type: 'number',
				default: 0,
				description: 'Legacy weekday bitmask (0-127), superseded by schedule_windows.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email Tag IDs',
				name: 'email_tag_ids',
				type: 'string',
				default: '',
				description: 'Mailbox tag ids that resolve the sender pool (tags strategy). Comma-separated list.',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'End Time',
				name: 'end_time',
				type: 'string',
				default: '',
				description: 'Legacy daily end (HH:MM).',
			},
			{
				displayName: 'ESP Match Mode',
				name: 'esp_match_mode',
				type: 'options',
				options: [
					{
						name: 'Off',
						value: 'off',
					},
					{
						name: 'Prefer',
						value: 'prefer',
					},
					{
						name: 'Strict',
						value: 'strict',
					},
				],
				default: 'off',
			},
			{
				displayName: 'Folder IDs',
				name: 'folder_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Link Tracking',
				name: 'link_tracking',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Max New Leads Per Day',
				name: 'max_new_leads_per_day',
				type: 'number',
				default: 0,
				description: '0 = unlimited.',
			},
			{
				displayName: 'Open Tracking',
				name: 'open_tracking',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Prioritize New Leads',
				name: 'prioritize_new_leads',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Ramp Ceiling',
				name: 'ramp_ceiling',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Ramp Enabled',
				name: 'ramp_enabled',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Ramp Increment',
				name: 'ramp_increment',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Ramp Start',
				name: 'ramp_start',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Risky Emails',
				name: 'risky_emails',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Rotation Mode',
				name: 'rotation_mode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Schedule Windows',
				name: 'schedule_windows',
				type: 'json',
				default: '',
				description: 'Per-day sending schedule. 7-element array indexed by time.Weekday (Sunday = 0); each day is a list of {start, end} minute intervals. When non-empty it supersedes days/start_time/end_time.',
			},
			{
				displayName: 'Sender Strategy',
				name: 'sender_strategy',
				type: 'options',
				options: [
					{
						name: 'Explicit',
						value: 'explicit',
					},
					{
						name: 'Tags',
						value: 'tags',
					},
				],
				default: 'tags',
			},
			{
				displayName: 'Senders',
				name: 'senders',
				type: 'json',
				default: '',
				description: 'Explicit-strategy mailbox pool.',
			},
			{
				displayName: 'Sequences',
				name: 'sequences',
				type: 'json',
				default: '',
				description: 'Initial sequence steps in order.',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Start Time',
				name: 'start_time',
				type: 'string',
				default: '',
				description: 'Legacy daily start (HH:MM).',
			},
			{
				displayName: 'Stop On Reply',
				name: 'stop_on_reply',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Text Only',
				name: 'text_only',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tracking Domain',
				name: 'tracking_domain',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Unsubscribe Header',
				name: 'unsubscribe_header',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Variants',
				name: 'variants',
				type: 'json',
				default: '',
				description: 'A/B variants for the first step.',
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
					'campaign',
				],
				operation: [
					'get',
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
					'campaign',
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
					'campaign',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'CC',
				name: 'cc',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Contact Order By',
				name: 'contact_order_by',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Contact Order Dir',
				name: 'contact_order_dir',
				type: 'options',
				options: [
					{
						name: 'Asc',
						value: 'asc',
					},
					{
						name: 'Desc',
						value: 'desc',
					},
				],
				default: 'asc',
			},
			{
				displayName: 'Contact Order Field',
				name: 'contact_order_field',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Daily Limit',
				name: 'daily_limit',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Days',
				name: 'days',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email Tags',
				name: 'email_tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'End Time',
				name: 'end_time',
				type: 'string',
				default: '',
			},
			{
				displayName: 'ESP Match Mode',
				name: 'esp_match_mode',
				type: 'options',
				options: [
					{
						name: 'Off',
						value: 'off',
					},
					{
						name: 'Prefer',
						value: 'prefer',
					},
					{
						name: 'Strict',
						value: 'strict',
					},
				],
				default: 'off',
			},
			{
				displayName: 'Folders',
				name: 'folders',
				type: 'string',
				default: '',
				description: 'Comma-separated list.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Link Tracking',
				name: 'link_tracking',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Max New Leads Per Day',
				name: 'max_new_leads_per_day',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Open Tracking',
				name: 'open_tracking',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Prioritize New Leads',
				name: 'prioritize_new_leads',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Ramp Ceiling',
				name: 'ramp_ceiling',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Ramp Enabled',
				name: 'ramp_enabled',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Ramp Increment',
				name: 'ramp_increment',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Ramp Start',
				name: 'ramp_start',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Risky Emails',
				name: 'risky_emails',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Rotation Mode',
				name: 'rotation_mode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Schedule Windows',
				name: 'schedule_windows',
				type: 'json',
				default: '',
				description: 'Per-day sending schedule. 7-element array indexed by time.Weekday (Sunday = 0); each day is a list of {start, end} minute intervals. When non-empty it supersedes days/start_time/end_time.',
			},
			{
				displayName: 'Sender Strategy',
				name: 'sender_strategy',
				type: 'options',
				options: [
					{
						name: 'Explicit',
						value: 'explicit',
					},
					{
						name: 'Tags',
						value: 'tags',
					},
				],
				default: 'tags',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Start Time',
				name: 'start_time',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Paused',
						value: 'paused',
					},
					{
						name: 'Paused No Accounts',
						value: 'paused_no_accounts',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
					{
						name: 'Stopped',
						value: 'stopped',
					},
				],
				default: 'draft',
				description: 'Campaign lifecycle status.',
			},
			{
				displayName: 'Stop On Reply',
				name: 'stop_on_reply',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Text Only',
				name: 'text_only',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tracking Domain',
				name: 'tracking_domain',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Unsubscribe Header',
				name: 'unsubscribe_header',
				type: 'boolean',
				default: false,
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
					'campaign',
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
					'campaign',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'getAbAnalysis',
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
					'campaign',
				],
				operation: [
					'getAdvanced',
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
					'campaign',
				],
				operation: [
					'updateAdvanced',
				],
			},
		},
	},
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'json',
		default: '',
		required: true,
		description: 'Advanced outreach overrides for a campaign.',
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'updateAdvanced',
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
					'campaign',
				],
				operation: [
					'updateAdvanced',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'getAttachments',
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
					'campaign',
				],
				operation: [
					'uploadAttachment',
				],
			},
		},
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
					'campaign',
				],
				operation: [
					'uploadAttachment',
				],
			},
		},
	},
	{
		displayName: 'Step ID',
		name: 'step_id',
		type: 'string',
		default: '',
		description: 'Scope the attachment to one sequence step.',
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'uploadAttachment',
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
					'campaign',
				],
				operation: [
					'uploadAttachment',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'deleteAttachment',
				],
			},
		},
	},
	{
		displayName: 'Attachment ID',
		name: 'attachmentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'deleteAttachment',
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
					'campaign',
				],
				operation: [
					'deleteAttachment',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'getLogs',
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
					'campaign',
				],
				operation: [
					'getLogs',
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
					'campaign',
				],
				operation: [
					'getLogs',
				],
				returnAll: [
					false,
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
					'campaign',
				],
				operation: [
					'preflight',
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
					'campaign',
				],
				operation: [
					'preflight',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'getSenders',
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
					'campaign',
				],
				operation: [
					'replaceSenders',
				],
			},
		},
	},
	{
		displayName: 'Senders',
		name: 'senders',
		type: 'json',
		default: '',
		required: true,
		description: 'The full new sender pool.',
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'replaceSenders',
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
					'campaign',
				],
				operation: [
					'replaceSenders',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'start',
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
					'campaign',
				],
				operation: [
					'start',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'stop',
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
					'campaign',
				],
				operation: [
					'stop',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'sendTestEmail',
				],
			},
		},
	},
	{
		displayName: 'Account ID',
		name: 'account_id',
		type: 'string',
		default: '',
		required: true,
		description: 'Sending mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'sendTestEmail',
				],
			},
		},
	},
	{
		displayName: 'Recipient',
		name: 'recipient',
		type: 'string',
		default: '',
		required: true,
		description: 'Where to send the test.',
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'sendTestEmail',
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
					'campaign',
				],
				operation: [
					'sendTestEmail',
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
				displayName: 'Step ID',
				name: 'step_id',
				type: 'string',
				default: '',
				description: 'Step to render and send; defaults to the first step.',
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
					'campaign',
				],
				operation: [
					'verifyTrackingDomain',
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
					'campaign',
				],
				operation: [
					'verifyTrackingDomain',
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
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: '',
		required: true,
		description: 'The instruction to generate from.',
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'generateWriting',
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
					'campaign',
				],
				operation: [
					'generateWriting',
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
				displayName: 'Tone',
				name: 'tone',
				type: 'string',
				default: '',
				description: 'Desired tone (e.g. friendly, direct).',
			},
		],
	},
];
