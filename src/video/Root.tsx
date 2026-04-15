import { Composition } from 'remotion'
import { VideoScene } from './VideoScene'

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="VideoScene"
        component={VideoScene as any}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  )
}
