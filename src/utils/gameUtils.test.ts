import { test, describe } from 'node:test'
import assert from 'node:assert'
import { getApprovalColor, formatCurrency, getSeverityColor } from './gameUtils.ts'

describe('gameUtils', () => {
  describe('getApprovalColor', () => {
    test('should return green for values >= 65', () => {
      assert.strictEqual(getApprovalColor(65), '#22c55e')
      assert.strictEqual(getApprovalColor(100), '#22c55e')
      assert.strictEqual(getApprovalColor(80), '#22c55e')
    })

    test('should return amber for values >= 40 and < 65', () => {
      assert.strictEqual(getApprovalColor(40), '#f59e0b')
      assert.strictEqual(getApprovalColor(64), '#f59e0b')
      assert.strictEqual(getApprovalColor(50), '#f59e0b')
    })

    test('should return red for values < 40', () => {
      assert.strictEqual(getApprovalColor(39), '#ef4444')
      assert.strictEqual(getApprovalColor(0), '#ef4444')
      assert.strictEqual(getApprovalColor(-10), '#ef4444')
    })
  })

  describe('formatCurrency', () => {
    test('should format trillions correctly', () => {
      assert.strictEqual(formatCurrency(1000000), '$1.0T')
      assert.strictEqual(formatCurrency(2500000), '$2.5T')
    })

    test('should format billions correctly', () => {
      assert.strictEqual(formatCurrency(1000), '$1.0B')
      assert.strictEqual(formatCurrency(999999), '$1000.0B')
      assert.strictEqual(formatCurrency(500), '$500M')
    })

    test('should format millions correctly', () => {
      assert.strictEqual(formatCurrency(100), '$100M')
      assert.strictEqual(formatCurrency(0), '$0M')
    })

    test('should handle negative values', () => {
      assert.strictEqual(formatCurrency(-1000000), '$-1.0T')
      assert.strictEqual(formatCurrency(-1000), '$-1.0B')
      assert.strictEqual(formatCurrency(-50), '$-50M')
    })
  })

  describe('getSeverityColor', () => {
    test('should return correct color for critical', () => {
      assert.strictEqual(getSeverityColor('critical'), 'text-red-400')
    })

    test('should return correct color for warning', () => {
      assert.strictEqual(getSeverityColor('warning'), 'text-amber-400')
    })

    test('should return correct color for info', () => {
      assert.strictEqual(getSeverityColor('info'), 'text-sky-400')
    })
  })
})
