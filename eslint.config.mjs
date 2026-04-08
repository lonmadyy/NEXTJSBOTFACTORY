import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextCoreWebVitals,
  {
    ignores: ['output/**', '.claude/**'],
  },
]

export default config
