import { _decorator, Component, misc, Quat, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ParamsUI')
export class ParamsUI extends Component {
    @property({type: Vec3})
    scaleMultiplierPortrait: Vec3 = new Vec3(1, 1, 1)

    @property({type: Vec3})
    scaleMultiplierLandscape: Vec3 = new Vec3(1, 1, 1)

    @property
    rotationMultiplierPortrait: number = 0

    @property
    rotationMultiplierLandscape: number = 0

    start() {
        // Слушаем изменения размера
        view.on('canvas-resize', this.updateScale, this);

        // Первоначальное применение настроек
        this.updateScale();
    }

    updateScale(){
        const scale = 1
        const frameSize = view.getFrameSize();
        const isPortrait = frameSize.height > frameSize.width;

        let rotationQuat = new Quat();
        Quat.fromAxisAngle(rotationQuat, new Vec3(0, 0, 1), misc.degreesToRadians(isPortrait ? this.rotationMultiplierPortrait : this.rotationMultiplierLandscape));

        // Применяем кватернион на объект
        this.node.setRotation(rotationQuat);

        this.node.scale = new Vec3(scale, scale, scale).multiply(isPortrait ? this.scaleMultiplierPortrait : this.scaleMultiplierLandscape)
    }
}


