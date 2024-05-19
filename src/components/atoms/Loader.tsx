import { type FC } from 'react'

type LoaderProps = {
  size: number
}

const STROKE_WIDTH = 2

const Loader: FC<LoaderProps> = (props) => {
  return (
    <svg className="animate-infinite-spin" style={{ width: props.size, height: props.size }}>
      <circle
        className="stroke-white animate-dash"
        cx={props.size / 2}
        cy={props.size / 2}
        r={props.size / 2 - STROKE_WIDTH / 2}
        fill="none"
        strokeWidth={STROKE_WIDTH}
      ></circle>
    </svg>
  )
}

export default Loader
