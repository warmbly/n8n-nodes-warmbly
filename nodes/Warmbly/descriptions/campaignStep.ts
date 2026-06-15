import type { INodeProperties } from 'n8n-workflow';

export const campaignStepOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'campaignStep',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a step',
				description: 'Create a step',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a step',
				description: 'Delete a step',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many campaign steps',
				description: 'Get many campaign steps',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a step',
				description: 'Update a step',
			},
		],
		default: 'getAll',
	},
];

export const campaignStepFields: INodeProperties[] = [
	{
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignStep',
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
					'campaignStep',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Step',
		name: 'body',
		type: 'json',
		default: '{}',
		required: true,
		description: 'The sequence step to create, as a JSON object (for example {"subject": "Hi {{first_name}}", "body_html": "...", "wait_days": 2}).',
		displayOptions: {
			show: {
				resource: [
					'campaignStep',
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
					'campaignStep',
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
		displayName: 'Campaign ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignStep',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Step ID',
		name: 'sid',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignStep',
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
					'campaignStep',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'json',
				default: '',
				description: 'Typed config for non-email nodes; type is the switch (wait, add_tag, remove_tag, unsubscribe, notify, create_task, create_deal, move_deal_stage, run_automation, end).',
			},
			{
				displayName: 'Body Code',
				name: 'body_code',
				type: 'boolean',
				default: false,
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
				displayName: 'Body Sync',
				name: 'body_sync',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Conditions',
				name: 'conditions',
				type: 'json',
				default: '',
				description: 'Branching tree ({branches: [...]}). Send {} or empty branches to clear branching.',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Optional client-generated key (1 to 255 chars). Retrying with the same key returns the original result instead of acting twice.',
			},
			{
				displayName: 'Kind',
				name: 'kind',
				type: 'options',
				options: [
					{
						name: 'Action',
						value: 'action',
					},
					{
						name: 'Email',
						value: 'email',
					},
					{
						name: 'Wait',
						value: 'wait',
					},
				],
				default: 'email',
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
				displayName: 'Wait After',
				name: 'wait_after',
				type: 'number',
				default: 0,
				description: 'Minutes to wait after this step (spacing model; no standalone wait node for email steps).',
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
					'campaignStep',
				],
				operation: [
					'delete',
				],
			},
		},
	},
	{
		displayName: 'Step ID',
		name: 'sid',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaignStep',
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
					'campaignStep',
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
