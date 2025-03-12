import { _decorator, Camera, Component, instantiate, Label, Node, Prefab, screen, Sprite, SpriteFrame, tween, UIOpacity, UITransform, Vec2, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinCounter')
export class CoinCounter extends Component {
    @property(Prefab)
    coin2DPrefab: Prefab = null;

    @property(Node)
    uiCanvas: Node = null;

    @property(Camera)
    mainCamera: Camera = null;

    countCoins: number = 0;

    increaseCoins(position: Vec3){
        const pos_ui = this.convertWorldToUI(position)
        const prefab = instantiate(this.coin2DPrefab)
        const opacity_component = prefab.getComponent(UIOpacity)

        const end_pos = this.node.worldPosition.clone()

        this.countCoins++
        
        this.updateLabel()

        this.uiCanvas.addChild(prefab)

        prefab.position.set(pos_ui.x, pos_ui.y, 0)

        prefab.scale.set(0.7, 0.7, 1)

        tween(prefab)
        .to(0.3, {worldPosition: end_pos})
        .to(0.35, {scale: new Vec3(0, 0, 0)})
        .call(() => {
            if(prefab) prefab.destroy()
        })
        .union()
        .start()

        tween(opacity_component)
        .to(0.3, {opacity: 0})
        .start()
    }

    updateLabel(){
        const label = this.node.getComponent(Label)

        label.string = '' + this.countCoins
    }

    convertWorldToUI(position: Vec3){
        const screenPosition = this.mainCamera.worldToScreen(position);

        // Получаем размеры экрана и Canvas
        const screenSize = screen.windowSize;
        const canvasSize = this.uiCanvas.getComponent(UITransform).contentSize;

        // Нормализуем экранные координаты относительно размера экрана
        const normalizedPosition = new Vec3(
            screenPosition.x / screenSize.width,
            screenPosition.y / screenSize.height,
            0
        );

        // Переводим в координаты Canvas с учетом центра Canvas
        const localPosition = new Vec3(
            (normalizedPosition.x - 0.5) * canvasSize.width,
            (normalizedPosition.y - 0.5) * canvasSize.height,
            0
        );

        return localPosition;
    }
}


