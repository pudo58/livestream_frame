const test = require('node:test');
const assert = require('node:assert');
const { formatK } = require('./formatK.js');

test('returns empty string for non-number', () => {
    assert.strictEqual(formatK('abc'), '');
});

test('formats numbers under 1000 without unit', () => {
    assert.strictEqual(formatK(500, 'en-US'), '500');
});

test('formats 1000 as 1k', () => {
    assert.strictEqual(formatK(1000, 'en-US'), '1k');
});

test('formats 1500 as 1.5k', () => {
    assert.strictEqual(formatK(1500, 'en-US'), '1.5k');
});

test('rounds 999999 to 1M', () => {
    assert.strictEqual(formatK(999999, 'en-US'), '1M');
});

test('formats 1000000 as 1M', () => {
    assert.strictEqual(formatK(1000000, 'en-US'), '1M');
});

test('handles negative numbers', () => {
    assert.strictEqual(formatK(-1500, 'en-US'), '-1.5k');
});

test('uses locale for decimal separator', () => {
    assert.strictEqual(formatK(1200, 'vi-VN'), '1,2k');
});
