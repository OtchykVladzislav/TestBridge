import { _decorator, AudioSource, Component, director, find, Node } from 'cc';
import { GameController } from '../scripts/GameController';
const { ccclass, property } = _decorator;

@ccclass('MRAID')
export class MRAID extends Component {
    @property(GameController)
    gameManager: GameController = null;

    private lastLogParams: string;

    //mraid visibility state
	isViewable = false;

	//Было ли сделано любое первое нажатие (котрое активирует автовоспроизведение видео)
	firstInteractionOccurred = false;

    onLoad() {
        document.addEventListener('visibilitychange', this.checkReady.bind(this));

        this.checkReady()
    }

    checkReady() {

        if (document.visibilityState === 'hidden') {
            this.setViewable(false)
            // Выключаем все звуки
            this.muteAllSounds()
        } else if (document.visibilityState === 'visible') {
            this.setViewable(true)
            // Включаем все звуки
            this.unmuteAllSounds()
        }

    }

    muteAllSounds() {
        // Находим все активные аудио компоненты на сцене
        const audioSources = director.getScene().getComponentsInChildren(AudioSource);

        if (this.gameManager.soundSource.playing) {
            this.gameManager.soundSource.pause();
        }
        
        audioSources.forEach(audioSource => {
            if (audioSource.playing) {
                audioSource.pause();
            }
        });
    }

    unmuteAllSounds() {
        // Находим все активные аудио компоненты на сцене
        const audioSources = director.getScene().getComponentsInChildren(AudioSource);

        if (this.gameManager.soundSource.playing) {
            this.gameManager.soundSource.play();
        }

        audioSources.forEach(audioSource => {
            if (!audioSource.playing) {
                audioSource.play();
            }
        });
    }



    setViewable(viewable: boolean, from: any = null) {

		this.isViewable = viewable;

		if (this.isViewable) {
			this.log('MRAID Viewable', from || '');

		} else {
			this.log('MRAID Hidden', from || '');
		}

	}

    log(...params){
        console.log.apply(console, Array.prototype.slice.call(arguments));

		this.lastLogParams = params.join(' - ');
    }
}


