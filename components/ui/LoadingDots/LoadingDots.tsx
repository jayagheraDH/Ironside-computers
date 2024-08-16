import s from './LoadingDots.module.css'

const LoadingDots: React.FC = () => {
  return (
    <span className={s.root + " loading-dots"}>
      <span />
      <span />
      <span />
    </span>
  )
}

export default LoadingDots
