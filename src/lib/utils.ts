import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatter used across dashboards and pricing
export function formatCurrency(
  amount: number,
  options: { currency?: string; minimumFractionDigits?: number } = {}
): string {
  const { currency = 'USD', minimumFractionDigits = 2 } = options
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits
    }).format(amount || 0)
  } catch {
    // Fallback for environments without Intl currency support
    return `$${(amount || 0).toFixed(minimumFractionDigits)}`
  }
}

// Format ratio 0.23 as "23%"; pass 23 to keep percent=true
export function formatPercentage(value: number, options: { alreadyPercent?: boolean } = {}): string {
  const { alreadyPercent = false } = options
  const ratio = alreadyPercent ? value / 100 : value
  return `${(ratio * 100).toFixed(0)}%`
}

// Human readable relative time like "3 days ago"
export function getRelativeTime(date: Date | string | number): string {
  const target = new Date(date)
  const diffMs = target.getTime() - Date.now()
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'seconds'],
    [60, 'minutes'],
    [24, 'hours'],
    [7, 'days'],
    [4.34524, 'weeks'],
    [12, 'months'],
    [Number.POSITIVE_INFINITY, 'years'],
  ]

  let duration = Math.round(diffMs / 1000)
  for (const [amount, unit] of divisions) {
    if (Math.abs(duration) < amount) {
      // @ts-ignore TS doesn't narrow unit string union well here
      return rtf.format(duration, unit)
    }
    duration = Math.round(duration / amount)
  }
  return rtf.format(0, 'seconds')
}