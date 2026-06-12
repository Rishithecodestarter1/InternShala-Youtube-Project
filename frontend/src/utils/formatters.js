// formatters.js - Small display helpers for counts and dates used across video pages.
export function formatViews(views = 0) {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
  if (views >= 1000) return `${Math.round(views / 1000)}K views`
  return `${views} views`
}

export function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}
