import { useNavigate } from 'react-router-dom'

type LogoProps = {
  src: string
  alt?: string
  to?: string
}

export function Logo({ src, alt = 'Logo', to = '/' }: LogoProps) {
  const navigate = useNavigate()

  return (
    <div
      className="sidebar-logo"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(to)}
    >
      <img src={src} alt={alt} />
    </div>
  )
}
