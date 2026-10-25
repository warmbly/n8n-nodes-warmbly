/**
 * The extractor reads Go handlers by shape. These pin the shapes the Warmbly
 * backend uses so a change to one of them shows up here, not as a silently
 * emptier node.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { boundBody, routeCall } = require('../../scripts/lib/handler-body.cjs');

describe('boundBody', () => {
	it('follows a json.RawMessage body into the array it is read as', () => {
		const body = `
	var raw json.RawMessage
	if err := c.ShouldBindJSON(&raw); err != nil {
	}
	var data []models.AddContact
	if err := json.Unmarshal(raw, &data); err != nil {
	}`;
		expect(boundBody(body)).toEqual({ kind: 'array', type: 'models.AddContact' });
	});

	it('prefers the selection object over its array field', () => {
		const body = `
	var raw json.RawMessage
	if err := c.ShouldBindJSON(&raw); err != nil {
	}
	var sel models.ContactSelection
	if err := json.Unmarshal(raw, &sel.Contacts); err != nil {
		if err := json.Unmarshal(raw, &sel); err != nil {
		}
	}`;
		expect(boundBody(body)).toEqual({ kind: 'named', type: 'models.ContactSelection' });
	});

	it('reads a request seeded with defaults', () => {
		const body = `
	req := models.UpsertOutreachSettingsRequest{Settings: models.DefaultAdvancedOutreachSettings()}
	if err := c.ShouldBindJSON(&req); err != nil {
	}`;
		expect(boundBody(body)).toEqual({
			kind: 'named',
			type: 'models.UpsertOutreachSettingsRequest',
		});
	});

	it('still reads a plain typed variable', () => {
		const body = `
	var req models.CreateThing
	if err := c.ShouldBindJSON(&req); err != nil {
	}`;
		expect(boundBody(body)).toEqual({ kind: 'named', type: 'models.CreateThing' });
	});

	it('returns null when there is no body', () => {
		expect(boundBody('c.JSON(200, nil)')).toBeNull();
	});
});

describe('routeCall', () => {
	it('joins a registration that continues on the next line', () => {
		const lines = [
			'contacts.GET("/lookup", m.RequireAccess(a, b),',
			'\tm.RequireAccessWithQuery("thread_id", c, d), h.LookupContactByEmail)',
			'next.GET("/x", h.Other)',
		];
		const joined = routeCall(lines, 0);
		expect(joined).toContain('h.LookupContactByEmail');
		expect(joined).not.toContain('h.Other');
	});

	it('keeps a single-line registration as is', () => {
		const lines = ['g.GET("/a", h.A)', 'g.GET("/b", h.B)'];
		expect(routeCall(lines, 0)).toBe('g.GET("/a", h.A)');
	});
});
