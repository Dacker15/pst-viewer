import { type ButtonHTMLAttributes, type DetailedHTMLProps, type FC, useMemo } from 'react'
import clsx from 'clsx'

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: 'outline' | 'filled' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
}

const Button: FC<ButtonProps> = ({ children, variant = 'outline', size = 'sm', rounded = true, ...props }) => {
  const className = useMemo(() => {
    return clsx(props.className, {
      'bg-white text-grey-500 border border-grey-400 hover:bg-grey-100 active:bg-grey-300 active:text-black':
        variant === 'outline',
      'bg-black text-white hover:text-grey-200 active:text-grey-300': variant === 'filled',
      'bg-grey-100 text-black hover:bg-grey-200 active:bg-grey-300': variant === 'ghost',
      'px-5 py-2 text-sm': size === 'sm',
      'px-8 py-4 text-base': size === 'md',
      'px-12 py-5 text-lg': size === 'lg',
      'rounded-full': rounded,
      'cursor-not-allowed opacity-50 pointer-events-none': props.disabled
    })
  }, [props.className, props.disabled, variant, size, rounded])

  return (
    <button {...props} className={className}>
      {children}
    </button>
  )
}

Button.displayName = 'Button'
export default Button
