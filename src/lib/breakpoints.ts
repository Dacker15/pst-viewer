import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.ts'

export const getBreakpoints = () => {
  const fullConfig = resolveConfig(tailwindConfig)
  return fullConfig.theme.screens
}
