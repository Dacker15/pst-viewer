import { useCallback, useEffect, useMemo, useState } from 'react'

type Breakpoints = Record<string, string | number>

export const useBreakpoint = (breakpoints: Breakpoints) => {
  const [activeBreakpoints, setActiveBreakpoints] = useState<string[]>([])

  const sanitizedBreakpoints = useMemo(() => {
    return Object.entries(breakpoints)
      .map<[string, number]>(([key, value]) => {
        let sanitizedValue: number
        if (typeof value === 'string') {
          const match = value.match(/^[0-9]*/)
          if (match) {
            sanitizedValue = Number(match[0])
          } else {
            sanitizedValue = -1
          }
        } else {
          sanitizedValue = value
        }
        return [key, sanitizedValue]
      }, {})
      .filter(([_, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
  }, [breakpoints])

  const handleResize = useCallback(() => {
    let activeIndex = -1
    for (let i = 0; i < sanitizedBreakpoints.length; i++) {
      const [_, value] = sanitizedBreakpoints[i]
      if (window.matchMedia(`(min-width: ${value}px)`).matches) {
        activeIndex = i
        break
      }
    }
    setActiveBreakpoints(sanitizedBreakpoints.slice(activeIndex).map(([key]) => key))
  }, [sanitizedBreakpoints])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return activeBreakpoints
}
