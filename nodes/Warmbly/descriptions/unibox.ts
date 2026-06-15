import type { INodeProperties } from 'n8n-workflow';

export const uniboxOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
			},
		},
		options: [
			{
				name: 'Cancel Scheduled Send',
				value: 'cancelScheduled',
				action: 'Cancel a scheduled send',
				description: 'Cancel a scheduled send',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many threads',
				description: 'Get many threads',
			},
			{
				name: 'Get Message',
				value: 'get',
				action: 'Get a message by id',
				description: 'Get a message by id',
			},
			{
				name: 'Get Overview',
				value: 'getOverview',
				action: 'Get inbox overview',
				description: 'Get inbox overview',
			},
			{
				name: 'Get Scheduled Sends',
				value: 'getScheduled',
				action: 'List scheduled sends',
				description: 'List scheduled sends',
			},
			{
				name: 'Get Snoozes',
				value: 'getSnoozes',
				action: 'List active snoozes',
				description: 'List active snoozes',
			},
			{
				name: 'Get Thread',
				value: 'getThread',
				action: 'Get a thread',
				description: 'Get a thread',
			},
			{
				name: 'Get Thread Labels',
				value: 'getThreadLabels',
				action: 'Get thread labels',
			},
			{
				name: 'Get Unseen Count',
				value: 'getCount',
				action: 'Get unread count',
				description: 'Get unread count',
			},
			{
				name: 'Mark Seen',
				value: 'markSeen',
				action: 'Mark messages seen',
				description: 'Mark messages seen',
			},
			{
				name: 'Reply',
				value: 'reply',
				action: 'Reply from the inbox',
				description: 'Reply from the inbox',
			},
			{
				name: 'Set Thread Labels',
				value: 'setThreadLabels',
				action: 'Set thread labels',
			},
			{
				name: 'Snooze',
				value: 'snooze',
				action: 'Snooze a thread',
				description: 'Snooze a thread',
			},
			{
				name: 'Unsnooze',
				value: 'unsnooze',
				action: 'Unsnooze a thread',
				description: 'Unsnooze a thread',
			},
		],
		default: 'getAll',
	},
];

export const uniboxFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'unibox',
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
					'unibox',
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
					'unibox',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Awaiting Reply',
				name: 'awaiting_reply',
				type: 'boolean',
				default: false,
				description: '`true` returns only threads whose latest message was sent by you.',
			},
			{
				displayName: 'Category IDs',
				name: 'category_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated conversation-label UUIDs. A thread matches if it carries any of them.',
			},
			{
				displayName: 'Email ID',
				name: 'email_id',
				type: 'string',
				default: '',
				description: 'Restrict to a single mailbox by UUID.',
				placeholder: 'name@email.com',
			},
			{
				displayName: 'Email IDs',
				name: 'email_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated mailbox UUIDs. A thread matches if it landed in any of them.',
				placeholder: 'name@email.com',
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'string',
				default: '',
				description: 'Filter by sender address (substring).',
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'string',
				default: '',
				description: 'Lower bound on date, `YYYY-MM-DD`.',
			},
			{
				displayName: 'Snoozed',
				name: 'snoozed',
				type: 'string',
				default: '',
				description: '`true` returns only snoozed threads. Omit to exclude snoozed threads.',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Filter by subject (substring).',
			},
			{
				displayName: 'Unseen',
				name: 'unseen',
				type: 'boolean',
				default: false,
				description: '`true` returns only threads with unread messages.',
			},
			{
				displayName: 'Until',
				name: 'until',
				type: 'string',
				default: '',
				description: 'Upper bound on date, `YYYY-MM-DD`.',
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
					'unibox',
				],
				operation: [
					'getCount',
				],
			},
		},
		options: [
			{
				displayName: 'Email ID',
				name: 'email_id',
				type: 'string',
				default: '',
				description: 'Optional mailbox UUID to count unread for a single mailbox.',
				placeholder: 'name@email.com',
			},
		],
	},
	{
		displayName: 'Email Account ID',
		name: 'email_account_id',
		type: 'string',
		default: '',
		required: true,
		description: 'UUID of the sending mailbox.',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'reply',
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
		description: 'Recipient addresses (at least one). Comma-separated list.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'reply',
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
					'unibox',
				],
				operation: [
					'reply',
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
					'unibox',
				],
				operation: [
					'reply',
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
				description: 'Message-ID(s) this reply threads under. Comma-separated list.',
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduled_at',
				type: 'dateTime',
				default: '',
				description: 'Required when `send_mode` is `scheduled`; must be in the future.',
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
				description: '`instant`, `smart` (next mailbox gap), or `scheduled`.',
			},
			{
				displayName: 'Thread ID',
				name: 'thread_id',
				type: 'string',
				default: '',
			},
		],
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
					'unibox',
				],
				operation: [
					'getScheduled',
				],
			},
		},
		options: [
			{
				displayName: 'Thread ID',
				name: 'thread_id',
				type: 'string',
				default: '',
				description: 'Restrict to scheduled sends queued into one thread.',
			},
		],
	},
	{
		displayName: 'Scheduled Task ID',
		name: 'task_id',
		type: 'string',
		default: '',
		required: true,
		description: 'UUID of the scheduled task to cancel.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'cancelScheduled',
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
					'unibox',
				],
				operation: [
					'cancelScheduled',
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
		displayName: 'Email IDs',
		name: 'email_ids',
		type: 'string',
		default: '',
		required: true,
		description: 'Message UUIDs to update (max 500). Comma-separated list.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'markSeen',
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
					'unibox',
				],
				operation: [
					'markSeen',
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
				displayName: 'Seen',
				name: 'seen',
				type: 'boolean',
				default: false,
				description: '`true` marks as read, `false` marks as unread.',
			},
		],
	},
	{
		displayName: 'Thread ID',
		name: 'thread_id',
		type: 'string',
		default: '',
		required: true,
		description: 'The thread to snooze.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'snooze',
				],
			},
		},
	},
	{
		displayName: 'Snoozed Until',
		name: 'snoozed_until',
		type: 'dateTime',
		default: '',
		required: true,
		description: 'RFC 3339 timestamp to un-hide the thread.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'snooze',
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
					'unibox',
				],
				operation: [
					'snooze',
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
		displayName: 'Thread ID',
		name: 'thread_id',
		type: 'string',
		default: '',
		required: true,
		description: 'The thread to un-snooze.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'unsnooze',
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
					'unibox',
				],
				operation: [
					'unsnooze',
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
		displayName: 'Thread ID',
		name: 'thread_id',
		type: 'string',
		default: '',
		required: true,
		description: 'The thread to read. Also accepted as `id`.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'getThread',
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
					'unibox',
				],
				operation: [
					'getThread',
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
					'unibox',
				],
				operation: [
					'getThread',
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
					'unibox',
				],
				operation: [
					'getThread',
				],
			},
		},
		options: [
			{
				displayName: 'Email ID',
				name: 'email_id',
				type: 'string',
				default: '',
				description: 'Optional mailbox UUID to scope the thread to one mailbox. Also accepted as `email`.',
				placeholder: 'name@email.com',
			},
		],
	},
	{
		displayName: 'Thread ID',
		name: 'thread_id',
		type: 'string',
		default: '',
		required: true,
		description: 'The thread to read labels for. Also accepted as `id`.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'getThreadLabels',
				],
			},
		},
	},
	{
		displayName: 'Thread ID',
		name: 'thread_id',
		type: 'string',
		default: '',
		required: true,
		description: 'The thread to label.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'setThreadLabels',
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
					'unibox',
				],
				operation: [
					'setThreadLabels',
				],
			},
		},
		options: [
			{
				displayName: 'Category IDs',
				name: 'category_ids',
				type: 'string',
				default: '',
				description: 'Full desired set of category UUIDs. An empty array clears all labels. Comma-separated list.',
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
		displayName: 'Message ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		description: 'UUID of the message.',
		displayOptions: {
			show: {
				resource: [
					'unibox',
				],
				operation: [
					'get',
				],
			},
		},
	},
];
