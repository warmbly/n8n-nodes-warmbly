/**
 * Pure unit tests for the node's response/parameter plumbing. No server needed.
 */
import { coerceValue, extractArray } from '../../nodes/Warmbly/GenericFunctions';

describe('extractArray', () => {
	it('returns a top-level array unchanged', () => {
		expect(extractArray([{ a: 1 }, { a: 2 }])).toEqual([{ a: 1 }, { a: 2 }]);
	});

	it('unwraps the { data, pagination } envelope', () => {
		expect(extractArray({ data: [{ id: 'x' }], pagination: { next_cursor: null } })).toEqual([
			{ id: 'x' },
		]);
	});

	it('falls back to the first array-valued property (e.g. event_types)', () => {
		expect(extractArray({ event_types: [{ type: 'campaign.reply_received' }] })).toEqual([
			{ type: 'campaign.reply_received' },
		]);
	});

	it('wraps a single object as one item', () => {
		expect(extractArray({ id: 'p1', name: 'Sales' })).toEqual([{ id: 'p1', name: 'Sales' }]);
	});

	it('returns an empty array for undefined', () => {
		expect(extractArray(undefined)).toEqual([]);
	});
});

describe('coerceValue', () => {
	it('parses a JSON string', () => {
		expect(coerceValue('{"a":1}', 'json')).toEqual({ a: 1 });
	});

	it('treats a blank JSON string as "omit"', () => {
		expect(coerceValue('   ', 'json')).toBeUndefined();
	});

	it('leaves invalid JSON untouched rather than throwing', () => {
		expect(coerceValue('{not json', 'json')).toBe('{not json');
	});

	it('splits and trims a comma string into a stringArray', () => {
		expect(coerceValue('a, b ,c', 'stringArray')).toEqual(['a', 'b', 'c']);
	});

	it('passes an existing array through for stringArray', () => {
		expect(coerceValue(['a', 'b'], 'stringArray')).toEqual(['a', 'b']);
	});

	it('coerces a numeric string to a number', () => {
		expect(coerceValue('42', 'number')).toBe(42);
	});

	it('passes null and undefined through unchanged', () => {
		expect(coerceValue(undefined, 'string')).toBeUndefined();
		expect(coerceValue(null, 'number')).toBeNull();
	});
});
