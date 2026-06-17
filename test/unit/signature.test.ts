/**
 * Pure unit tests for the webhook signature verifier: the security-critical
 * gate that rejects spoofed Warmbly deliveries. No server required.
 *
 * Mirrors the server's scheme: header `t=<ts>,v1=<hex>`, where
 * `v1 = HMAC_SHA256(secret, "<ts>.<rawBody>")`.
 */
import { createHmac } from 'crypto';

import { verifyWarmblySignature } from '../../nodes/Warmbly/GenericFunctions';

const sign = (secret: string, timestamp: string, body: string): string => {
	const v1 = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
	return `t=${timestamp},v1=${v1}`;
};

describe('verifyWarmblySignature', () => {
	const secret = 'whsec_test_secret';
	const timestamp = '1718500000';
	const body = JSON.stringify({ event_type: 'campaign.reply_received', id: 'evt_123' });

	it('accepts a correctly signed payload', () => {
		expect(verifyWarmblySignature(secret, sign(secret, timestamp, body), body)).toBe(true);
	});

	it('is insensitive to the order of header parts', () => {
		const v1 = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
		expect(verifyWarmblySignature(secret, `v1=${v1},t=${timestamp}`, body)).toBe(true);
	});

	it('rejects a tampered body', () => {
		const header = sign(secret, timestamp, body);
		expect(verifyWarmblySignature(secret, header, `${body} `)).toBe(false);
	});

	it('rejects a wrong secret', () => {
		expect(verifyWarmblySignature('whsec_wrong', sign(secret, timestamp, body), body)).toBe(false);
	});

	it('rejects a swapped timestamp (the t is part of the signed payload)', () => {
		const header = sign(secret, timestamp, body).replace(timestamp, '1700000000');
		expect(verifyWarmblySignature(secret, header, body)).toBe(false);
	});

	it('rejects missing or malformed input', () => {
		expect(verifyWarmblySignature(secret, '', body)).toBe(false);
		expect(verifyWarmblySignature(secret, 'garbage', body)).toBe(false);
		expect(verifyWarmblySignature(secret, 't=1', body)).toBe(false);
		expect(verifyWarmblySignature('', sign(secret, timestamp, body), body)).toBe(false);
	});
});
