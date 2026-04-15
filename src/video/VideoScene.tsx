import { type ReactNode } from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, spring } from 'remotion'

export interface VideoSceneProps {
  title: string
  subtitle: string
  scenes: {
    title: string
    description: string
    duration: number
    image: string
  }[]
}

const VideoScene: React.FC<VideoSceneProps> = ({ title, subtitle, scenes }) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 30], [0, 1])
  const scale = spring({ frame, fps: 30, from: 0.8, to: 1 })

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #0C1A36 0%, #1641C4 100%)', fontFamily: 'Syne, sans-serif', color: 'white', opacity, transform: `scale(${scale})` }}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <h1 style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 16 }}>{title}</h1>
        <p style={{ fontSize: 32, opacity: 0.9 }}>{subtitle}</p>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export { VideoScene }
