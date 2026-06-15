import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	coerceValue,
	extractArray,
	getPipelines,
	getPipelineStages,
	warmblyApiRequest,
	warmblyApiRequestAllItems,
	warmblyApiUpload,
} from './GenericFunctions';
import { RESOURCE_OPERATIONS } from './OperationRegistry';
import type { WarmblyOperationMeta } from './OperationRegistry';
import { fieldProperties, operationProperties, resourceProperty } from './descriptions';

export class Warmbly implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Warmbly',
		name: 'warmbly',
		icon: 'file:warmbly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the Warmbly cold email, warmup, CRM and deliverability API',
		defaults: {
			name: 'Warmbly',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'warmblyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [resourceProperty, ...operationProperties, ...fieldProperties],
	};

	methods = {
		loadOptions: {
			getPipelines,
			getPipelineStages,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const meta: WarmblyOperationMeta | undefined = RESOURCE_OPERATIONS[resource]?.[operation];
		if (!meta) {
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not supported for resource "${resource}".`,
			);
		}

		for (let i = 0; i < items.length; i++) {
			try {
				let endpoint = meta.path;
				const qs: IDataObject = {};
				const body: IDataObject = {};
				const headers: IDataObject = {};
				const collectionCache: Record<string, IDataObject> = {};

				// Resolve every declared field to its place in the request.
				for (const field of meta.fields) {
					if (field.bodyField) {
						continue; // single-field bodies are handled below
					}
					let value: unknown;
					if (field.loc === 'top') {
						value = this.getNodeParameter(field.name, i, undefined);
					} else {
						if (collectionCache[field.loc] === undefined) {
							collectionCache[field.loc] = this.getNodeParameter(
								field.loc,
								i,
								{},
							) as IDataObject;
						}
						value = collectionCache[field.loc][field.name];
					}

					if (value === undefined || value === null || value === '') {
						continue;
					}
					value = coerceValue(value, field.type);
					if (value === undefined) {
						continue;
					}

					if (field.in === 'path') {
						endpoint = endpoint.replace(
							`{${field.apiName}}`,
							encodeURIComponent(String(value)),
						);
					} else if (field.in === 'query') {
						qs[field.apiName] = value;
					} else if (field.in === 'header') {
						headers[field.apiName] = value as string;
					} else {
						body[field.apiName] = value;
					}
				}

				let responseItems: IDataObject[];

				if (meta.multipart) {
					// Resolve any path params that live alongside the file.
					for (const field of meta.fields) {
						if (field.in === 'path') {
							const value = this.getNodeParameter(field.name, i) as string;
							endpoint = endpoint.replace(
								`{${field.apiName}}`,
								encodeURIComponent(value),
							);
						}
					}
					const binaryPropertyName = this.getNodeParameter(
						'binaryPropertyName',
						i,
					) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					const formData: IDataObject = {
						file: {
							value: buffer,
							options: {
								filename: binaryData.fileName ?? 'upload',
								contentType: binaryData.mimeType,
							},
						},
					};
					// Any non-file body fields (e.g. the import "options" JSON string).
					for (const field of meta.fields) {
						if (field.in !== 'body') {
							continue;
						}
						const value = this.getNodeParameter(field.name, i, undefined);
						if (value !== undefined && value !== '') {
							formData[field.apiName] = String(value);
						}
					}
					const uploadResponse = await warmblyApiUpload.call(
						this,
						meta.method as never,
						endpoint,
						formData,
					);
					responseItems = extractArray(uploadResponse);
				} else {
					// Single-field bodies: array of objects / strings, or a raw JSON object.
					let requestBody: IDataObject | IDataObject[] | string = body;
					if (meta.bodyField) {
						const raw = this.getNodeParameter(meta.bodyField, i, undefined);
						requestBody = coerceValue(
							raw,
							meta.bodyFieldType ?? 'json',
						) as IDataObject | IDataObject[];
					}

					if (meta.returnsList && meta.paginated) {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						if (returnAll) {
							responseItems = await warmblyApiRequestAllItems.call(
								this,
								meta.method as never,
								endpoint,
								body,
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', i, 50) as number;
							const response = await warmblyApiRequest.call(
								this,
								meta.method as never,
								endpoint,
								requestBody,
								qs,
								headers,
							);
							responseItems = extractArray(response).slice(0, qs.limit as number);
						}
					} else {
						const response = await warmblyApiRequest.call(
							this,
							meta.method as never,
							endpoint,
							requestBody,
							qs,
							headers,
						);
						responseItems = meta.returnsList
							? extractArray(response)
							: [response as IDataObject];
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseItems),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
