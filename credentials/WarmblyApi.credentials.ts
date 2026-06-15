import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WarmblyApi implements ICredentialType {
	name = 'warmblyApi';

	displayName = 'Warmbly API';

	documentationUrl = 'https://docs.warmbly.com/api/authentication';

	icon = { light: 'file:../nodes/Warmbly/warmbly.svg', dark: 'file:../nodes/Warmbly/warmbly.svg' } as const;

	httpRequestNode = {
		name: 'Warmbly',
		docsUrl: 'https://docs.warmbly.com/api',
		apiBaseUrlPlaceholder: 'https://api.warmbly.com/v1/campaigns',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your Warmbly API key (starts with <code>wmbly_</code>). Create one under Settings → API keys in the dashboard. The key inherits the scopes you grant it.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.warmbly.com/v1',
			required: true,
			description:
				'The versioned API base URL. Leave as the default for Warmbly Cloud, or point it at your own instance when self-hosting (for example <code>https://api.yourdomain.com/v1</code>).',
			placeholder: 'https://api.warmbly.com/v1',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/timezones',
			method: 'GET',
		},
	};
}
