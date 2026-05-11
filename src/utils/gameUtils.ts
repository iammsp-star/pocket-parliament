export type AlertSeverity = 'info' | 'warning' | 'critical'

export const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}T`
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}B`
  return `$${value.toFixed(0)}M`
}

export const getSeverityColor = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'critical': return 'text-red-400'
    case 'warning': return 'text-amber-400'
    case 'info': return 'text-sky-400'
  }
}

export const getApprovalColor = (value: number): string => {
  if (value >= 65) return '#22c55e'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}
