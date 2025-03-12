import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property(AudioClip)
    soundBgSound: AudioClip;

    @property(AudioClip)
    carSound: AudioClip;

    @property(AudioClip)
    failSound: AudioSource;

    soundMode: boolean = true;

    playMusic(clip: AudioSource){
        clip.play()
    }

    update(deltaTime: number) {
        
    }
}


