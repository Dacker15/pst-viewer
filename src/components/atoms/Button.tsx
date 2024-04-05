import { type ButtonHTMLAttributes, type DetailedHTMLProps, type FC, useMemo } from 'react'
import clsx from 'clsx'

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: 'outline' | 'filled' | 'ghost'
}

const Button: FC<ButtonProps> = ({ children, variant = 'outline', ...props }) => {
  const className = useMemo(() => {
    return clsx(props.className, 'px-5 py-2 rounded-full', {
      'bg-white text-grey-500 border border-grey-400 hover:bg-grey-100 active:bg-grey-300 active:text-black':
        variant === 'outline',
      'bg-black text-white hover:text-grey-200 active:text-grey-300': variant === 'filled',
      'bg-grey-100 text-black hover:bg-grey-200 active:bg-grey-300': variant === 'ghost'
    })
  }, [props.className, variant])

  return (
    <button className={`${className} `} {...props}>
      {children}
    </button>
  )
}

Button.displayName = 'Button'
export default Button
