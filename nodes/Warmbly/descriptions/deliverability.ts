import type { INodeProperties } from 'n8n-workflow';

export const deliverabilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'deliverability',
				],
			},
		},
		options: [
			{
				name: 'Ingest Event',
				value: 'ingestEvent',
				action: 'Ingest a deliverability event',
				description: 'Ingest a deliverability event',
			},
		],
		default: 'ingestEvent',
	},
];

export const deliverabilityFields: INodeProperties[] = [
	{
		displayName: 'Event Type',
		name: 'event_type',
		type: 'options',
		options: [
			{
				name: 'Bounce',
				value: 'bounce',
			},
			{
				name: 'Click',
				value: 'click',
			},
			{
				name: 'Complaint',
				value: 'complaint',
			},
			{
				name: 'Open',
				value: 'open',
			},
			{
				name: 'Reply',
				value: 'reply',
			},
			{
				name: 'Unsubscribe',
				value: 'unsubscribe',
			},
		],
		default: 'bounce',
		required: true,
		description: 'The deliverability signal type.',
		displayOptions: {
			show: {
				resource: [
					'deliverability',
				],
				operation: [
					'ingestEvent',
				],
			},
		},
	},
	{
		displayName: 'Recipient Email',
		name: 'recipient_email',
		type: 'string',
		default: '',
		required: true,
		description: 'The recipient address the event is about.',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: [
					'deliverability',
				],
				operation: [
					'ingestEvent',
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
					'deliverability',
				],
				operation: [
					'ingestEvent',
				],
			},
		},
		options: [
			{
				displayName: 'Campaign ID',
				name: 'campaign_id',
				type: 'string',
				default: '',
				description: 'Campaign the event is attributed to.',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Contact the event is attributed to.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotency_key',
				type: 'string',
				default: '',
				description: 'De-duplicates retried events.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '',
				description: 'Free-form JSON attached to the event.',
			},
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'string',
				default: '',
				description: 'Source provider label (e.g. ses, postmark).',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'Human-readable reason or diagnostic text.',
			},
			{
				displayName: 'Task ID',
				name: 'task_id',
				type: 'string',
				default: '',
				description: 'Send task the event is attributed to.',
			},
		],
	},
];
