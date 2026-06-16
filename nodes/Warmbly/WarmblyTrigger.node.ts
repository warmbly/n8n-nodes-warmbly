import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { extractArray, verifyWarmblySignature, warmblyApiRequest } from './GenericFunctions';
import { webhookEvents } from './WebhookEvents';

export class WarmblyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Warmbly Trigger',
		name: 'warmblyTrigger',
		icon: 'file:warmbly.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].length + " event(s)"}}',
		description: 'Starts a workflow when a Warmbly event fires (via a signed webhook)',
		defaults: {
			name: 'Warmbly Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'warmblyApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				default: [],
				description:
					'The events to subscribe to. Leave empty to receive all events except high-volume (firehose) ones, which must always be selected explicitly.',
				options: webhookEvents,
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'A label stored on the Warmbly endpoint for your own reference',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return false;
				}
				const response = await warmblyApiRequest.call(this, 'GET', '/webhooks');
				const endpoints = extractArray(response);
				const exists = endpoints.some((endpoint) => endpoint.id === webhookData.webhookId);
				if (!exists) {
					delete webhookData.webhookId;
					delete webhookData.webhookSecret;
				}
				return exists;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events', []) as string[];
				const options = this.getNodeParameter('options', {}) as IDataObject;

				const body: IDataObject = {
					url: webhookUrl,
					event_types: events,
					enabled: true,
				};
				if (options.description) {
					body.description = options.description;
				}

				const response = await warmblyApiRequest.call(this, 'POST', '/webhooks', body);
				if (response?.id === undefined) {
					return false;
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = response.id as string;
				webhookData.webhookSecret = response.secret as string;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId !== undefined) {
					try {
						await warmblyApiRequest.call(
							this,
							'DELETE',
							`/webhooks/${webhookData.webhookId}`,
						);
					} catch {
						return false;
					}
					delete webhookData.webhookId;
					delete webhookData.webhookSecret;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const headers = this.getHeaderData() as IDataObject;
		const bodyData = this.getBodyData() as IDataObject;
		const webhookData = this.getWorkflowStaticData('node');

		// Endpoint-verification handshake: Warmbly POSTs a `webhook.test` event with
		// a challenge token. Echo it (in the body and the challenge header) and a 2xx
		// so the endpoint becomes verified — do not start the workflow.
		const eventType = (headers['x-warmbly-event'] as string) ?? (bodyData.event_type as string);
		if (eventType === 'webhook.test' || bodyData.challenge !== undefined) {
			const challenge = bodyData.challenge as string | undefined;
			const res = this.getResponseObject();
			if (challenge) {
				res.setHeader('X-Warmbly-Webhook-Challenge', challenge);
			}
			res.status(200).json({ challenge: challenge ?? '' });
			return { noWebhookResponse: true };
		}

		// Verify the HMAC-SHA256 signature when we hold the signing secret.
		const secret = webhookData.webhookSecret as string | undefined;
		const signatureHeader = headers['x-warmbly-signature'] as string | undefined;
		if (secret && signatureHeader) {
			const rawBody = Buffer.isBuffer(req.rawBody)
				? req.rawBody.toString('utf8')
				: JSON.stringify(bodyData);
			if (!verifyWarmblySignature(secret, signatureHeader, rawBody)) {
				const res = this.getResponseObject();
				res.status(401).send('Invalid signature');
				return { noWebhookResponse: true };
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
