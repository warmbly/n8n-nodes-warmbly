import type { INodeProperties } from 'n8n-workflow';

export const mailboxOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
			},
		},
		options: [
			{
				name: 'Check Domain Authentication',
				value: 'authCheck',
				action: 'Check domain authentication',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a mailbox',
				description: 'Delete a mailbox',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a mailbox',
				description: 'Get a mailbox',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many mailboxes',
				description: 'Get many mailboxes',
			},
			{
				name: 'Get Warmup Ban Status',
				value: 'warmupBanStatus',
				action: 'Get warmup ban status',
			},
			{
				name: 'Pause Warmup',
				value: 'warmupPause',
				action: 'Pause warmup',
			},
			{
				name: 'Resume Warmup',
				value: 'warmupResume',
				action: 'Resume warmup',
			},
			{
				name: 'Send Email',
				value: 'send',
				action: 'Send from a mailbox',
				description: 'Send from a mailbox',
			},
			{
				name: 'Start Warmup',
				value: 'warmupStart',
				action: 'Start warmup',
			},
			{
				name: 'Stop Warmup',
				value: 'warmupStop',
				action: 'Stop warmup',
			},
			{
				name: 'Submit Warmup Appeal',
				value: 'warmupAppeal',
				action: 'Submit a warmup appeal',
				description: 'Submit a warmup appeal',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a mailbox',
				description: 'Update a mailbox',
			},
			{
				name: 'Update Tracking Domain',
				value: 'updateTrackingDomain',
				action: 'Update the tracking domain',
				description: 'Update the tracking domain',
			},
			{
				name: 'Verify Address',
				value: 'verify',
				action: 'Verify an email address',
				description: 'Verify an email address',
			},
		],
		default: 'getAll',
	},
];

export const mailboxFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
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
					'mailbox',
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
					'mailbox',
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
				description: 'Free-text search over mailbox address and name.',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Tag id to filter by.',
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
					'mailbox',
				],
				operation: [
					'verify',
				],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'The address to verify.',
				placeholder: 'name@email.com',
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
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox (email account) id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'get',
				],
			},
		},
	},
	{
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
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
					'mailbox',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Campaign Limit',
				name: 'campaign_limit',
				type: 'number',
				default: 0,
				description: 'Daily cold-campaign cap (validated up to 100).',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Min Wait Time',
				name: 'min_wait_time',
				type: 'number',
				default: 0,
				description: 'Minimum seconds between sends.',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name on outgoing mail.',
			},
			{
				displayName: 'Reply To',
				name: 'reply_to',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Signature Code',
				name: 'signature_code',
				type: 'boolean',
				default: false,
				description: 'Treat the HTML signature as raw code.',
			},
			{
				displayName: 'Signature HTML',
				name: 'signature_html',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Signature Plain',
				name: 'signature_plain',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Signature Sync',
				name: 'signature_sync',
				type: 'boolean',
				default: false,
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
						name: 'Inactive',
						value: 'inactive',
					},
					{
						name: 'Revoked',
						value: 'revoked',
					},
				],
				default: 'active',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Tag ids assigned to the mailbox. Comma-separated list.',
			},
			{
				displayName: 'Warmup',
				name: 'warmup',
				type: 'boolean',
				default: false,
				description: 'Enable or disable warmup.',
			},
			{
				displayName: 'Warmup Base',
				name: 'warmup_base',
				type: 'number',
				default: 0,
				description: 'Warmup starting volume per day.',
			},
			{
				displayName: 'Warmup Days',
				name: 'warmup_days',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Warmup End Time',
				name: 'warmup_end_time',
				type: 'string',
				default: '',
				description: 'Daily warmup window end, HH:MM.',
			},
			{
				displayName: 'Warmup Increase',
				name: 'warmup_increase',
				type: 'number',
				default: 0,
				description: 'Per-day warmup ramp increment.',
			},
			{
				displayName: 'Warmup Max',
				name: 'warmup_max',
				type: 'number',
				default: 0,
				description: 'Warmup daily ceiling.',
			},
			{
				displayName: 'Warmup Reply Rate',
				name: 'warmup_reply_rate',
				type: 'number',
				default: 0,
				description: 'Percentage of warmup threads to reply to.',
			},
			{
				displayName: 'Warmup Start Time',
				name: 'warmup_start_time',
				type: 'string',
				default: '',
				description: 'Daily warmup window start, HH:MM.',
			},
			{
				displayName: 'Warmup Tag',
				name: 'warmup_tag',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
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
					'mailbox',
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
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id. The domain is derived from the mailbox address.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'authCheck',
				],
			},
		},
	},
	{
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The sending mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'send',
				],
			},
		},
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		default: '',
		required: true,
		description: 'Recipient addresses. Comma-separated list.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'send',
				],
			},
		},
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'send',
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
					'mailbox',
				],
				operation: [
					'send',
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
				displayName: 'CC',
				name: 'cc',
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
				displayName: 'In Reply To',
				name: 'in_reply_to',
				type: 'string',
				default: '',
				description: 'Message ids this email replies to. Comma-separated list.',
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduled_at',
				type: 'dateTime',
				default: '',
				description: 'Required when send_mode is scheduled. Must be in the future.',
			},
			{
				displayName: 'Send Mode',
				name: 'send_mode',
				type: 'options',
				options: [
					{
						name: 'Instant',
						value: 'instant',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
					{
						name: 'Smart',
						value: 'smart',
					},
				],
				default: 'instant',
				description: 'instant (default), smart (next per-mailbox scheduler gap), or scheduled (use scheduled_at).',
			},
			{
				displayName: 'Thread ID',
				name: 'thread_id',
				type: 'string',
				default: '',
				description: 'Thread id to attach the message to.',
			},
		],
	},
	{
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'updateTrackingDomain',
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
					'mailbox',
				],
				operation: [
					'updateTrackingDomain',
				],
			},
		},
		options: [
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				description: 'The custom tracking subdomain (for example t.acme.com). Empty clears it.',
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
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'warmupAppeal',
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
					'mailbox',
				],
				operation: [
					'warmupAppeal',
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
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'The owner\'s explanation for the appeal.',
			},
		],
	},
	{
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'warmupBanStatus',
				],
			},
		},
	},
	{
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'warmupPause',
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
					'mailbox',
				],
				operation: [
					'warmupPause',
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
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'warmupResume',
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
					'mailbox',
				],
				operation: [
					'warmupResume',
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
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'warmupStart',
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
					'mailbox',
				],
				operation: [
					'warmupStart',
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
		displayName: 'Mailbox ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'The mailbox id.',
		displayOptions: {
			show: {
				resource: [
					'mailbox',
				],
				operation: [
					'warmupStop',
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
					'mailbox',
				],
				operation: [
					'warmupStop',
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
