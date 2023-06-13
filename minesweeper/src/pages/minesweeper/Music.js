import Sound from 'react-sound';
import music from './Graze the Roof.mp3'

export default function Music() {
    return (
        <Sound
            playStatus={Sound.status.PAUSED}
            url={music}
            playFromPosition={300}
            loop={true}
        />
    )
}