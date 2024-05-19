import { type FC, useMemo } from 'react'
import clsx from 'clsx'

type DescriptionProps = {
  text: string
  className?: string
}

const Description: FC<DescriptionProps> = ({ text, className }) => {
  const finalClasses = useMemo(() => clsx('whitespace-pre-line', className), [className])

  return <p className={finalClasses}>{text}</p>
}

export default Description
