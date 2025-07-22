// 主题配置文件
export const theme = {
  // 颜色配置
  colors: {
    primary: {
      light: '#60a5fa', // blue-400
      main: '#3b82f6',  // blue-500
      dark: '#2563eb',  // blue-600
    },
    secondary: {
      light: '#a78bfa', // violet-400
      main: '#8b5cf6',  // violet-500
      dark: '#7c3aed',  // violet-600
    },
    success: {
      light: '#4ade80', // green-400
      main: '#22c55e',  // green-500
      dark: '#16a34a',  // green-600
    },
    warning: {
      light: '#fbbf24', // yellow-400
      main: '#f59e0b',  // yellow-500
      dark: '#d97706',  // yellow-600
    },
    danger: {
      light: '#f87171', // red-400
      main: '#ef4444',  // red-500
      dark: '#dc2626',  // red-600
    },
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    }
  },
  
  // 布局配置
  layout: {
    containerMaxWidth: '1400px',
    cardSpacing: '1.5rem', // 24px
    sectionSpacing: '2rem', // 32px
  },
  
  // 动画配置
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // 圆角配置
  borderRadius: {
    small: '0.375rem',  // 6px
    medium: '0.5rem',   // 8px
    large: '0.75rem',   // 12px
    xl: '1rem',         // 16px
  },
  
  // 阴影配置
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // 字体配置
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
}

// 获取主题变量的辅助函数
export const getThemeColor = (colorPath: string): string => {
  const paths = colorPath.split('.')
  let value: any = theme.colors
  
  for (const path of paths) {
    value = value[path]
    if (!value) return ''
  }
  
  return value
}

// 生成 CSS 变量
export const generateCSSVariables = () => {
  const cssVars: Record<string, string> = {}
  
  // 颜色变量
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([shade, color]) => {
        cssVars[`--color-${key}-${shade}`] = color as string
      })
    }
  })
  
  // 其他变量
  cssVars['--container-max-width'] = theme.layout.containerMaxWidth
  cssVars['--card-spacing'] = theme.layout.cardSpacing
  cssVars['--section-spacing'] = theme.layout.sectionSpacing
  
  return cssVars
}
