import { type ButtonHTMLAttributes, type DetailedHTMLProps, type FC, useMemo } from 'react'
import clsx from 'clsx'

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: 'outline' | 'text' | 'ghost'
}

const Button: FC<ButtonProps> = ({ children, variant = 'outline', ...props }) => {
  const className = useMemo(() => {
    return clsx(props.className, 'px-5 py-2 rounded-full', {
      'bg-white text-grey-500 border border-grey-400 hover:bg-grey-100 active:bg-grey-300 active:text-black':
        variant === 'outline',
      'text-blue-500': variant === 'text',
      'bg-transparent text-blue-500': variant === 'ghost'
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
