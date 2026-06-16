// Two projects:
//   unit — pure, fast, no network; runs in CI (`npm test`).
//   e2e  — drives the real node against a running Warmbly server; run locally
//          or in an integration job (`npm run test:e2e`).
//
// `isolatedModules` transpiles each test with no whole-program type-checking,
// so the strict package tsconfig (noUnusedLocals, etc.) doesn't fight the specs.
const tsTransform = {
	'^.+\\.ts$': ['ts-jest', { isolatedModules: true, diagnostics: false }],
};

const common = {
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js', 'json'],
	transform: tsTransform,
};

module.exports = {
	projects: [
		{
			...common,
			displayName: 'unit',
			roots: ['<rootDir>/test/unit'],
		},
		{
			...common,
			displayName: 'e2e',
			roots: ['<rootDir>/test/e2e'],
		},
	],
};
