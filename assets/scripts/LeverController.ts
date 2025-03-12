import { _decorator, Component, Node, Vec3, EventTouch, tween } from 'cc';
import { CarController } from './CarController';
const { ccclass, property } = _decorator;

@ccclass('LeverController')
export class LeverController extends Component {
    @property(Node) car: Node = null;
    @property(Node) leverHandle: Node = null;
    @property({ type: Number }) minY: number = -115;
    @property({ type: Number }) maxY: number = 115;
    @property({ type: Number }) returnSpeed: number = 0.1;

    private isDragging: boolean = false;
    private leverValue: number = 0;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(){
        this.isDragging = true;
    }

    onTouchMove(event: EventTouch) {
        if(!this.isDragging) return;
        let delta = event.getDelta();
        let newPos = this.leverHandle.position.clone();
        newPos.y += delta.y * 2;
        newPos.y = Math.max(this.minY, Math.min(this.maxY, newPos.y));
        this.leverHandle.setPosition(newPos);

        this.leverValue = (newPos.y - this.minY) / (this.maxY - this.minY);
        this.updateCarSpeed();
    }

    onTouchEnd() {
        this.isDragging = false;
        // Возвращаем рычаг в середину плавно
        tween(this.leverHandle)
            .to(this.returnSpeed, { position: new Vec3(0, this.minY, 0) })
            .call(() => {
                this.leverValue = 0;
                this.updateCarSpeed();
            })
            .start();
    }

    updateCarSpeed() {
        if (this.car) {
            let carController = this.car.getComponent(CarController);
            if (carController) {
                carController.setSpeed(this.leverValue * carController.maxSpeed);
            }
        }
    }
}
