/* Une nombres de clase ignorando valores vacíos: cx(a, cond && b) */
export const cx = (...c) => c.filter(Boolean).join(' ')
