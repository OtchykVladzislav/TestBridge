import { _decorator, AudioSource, Component, input, Input, Node, tween, UIOpacity, Vec3 } from 'cc';
import { CarController } from './CarController';
import { BridgeController } from './BridgeController';
import { Target } from '../main/Target';
import { SoundManager } from './SoundManager';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(SoundManager)
    soundManager : SoundManager;

    @property(Node)
    ui: Node = null

    @property(Node)
    ui_cta: Node = null

    @property(Node)
    handler: Node = null
    
    soundSource = new AudioSource();

    start(){
        this.soundSource.loop = true
        this.soundSource.clip = this.soundManager.soundBgSound
        
        this.handler.on(Node.EventType.TOUCH_START, this.firstTouch, this)
    }

    firstTouch(){
        this.soundSource.play()

        this.handler.off(Node.EventType.TOUCH_START, this.firstTouch, this)
    }

    transferToCTA(){
        const start_screen = this.ui.getComponent(UIOpacity)
        const end_screen = this.ui_cta.getComponent(UIOpacity)
        const target = this.node.getComponent(Target)
        const button_cta = this.ui_cta.getChildByPath('ButtonContainer')

        this.soundManager.playMusic(this.soundManager.failSound)

        this.ui_cta.active = true
        end_screen.enabled = true

        target.game_end()

        tween(start_screen)
        .to(0.3, {opacity: 0})
        .start()

        tween(end_screen)
        .to(0.3, {opacity: 255})
        .start()

        tween(button_cta)
        .to(0.5, {scale: new Vec3(0.8, 0.8, 0.8)})
        .to(0.5, {scale: new Vec3(1, 1, 1)})
        .union()
        .repeatForever()
        .start()
    }
}
