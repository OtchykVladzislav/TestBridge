import { _decorator, Component, RigidBody, Vec3, Collider, HingeConstraint, ERigidBodyType, MeshRenderer, isValid } from 'cc';
import { CarController } from './CarController';
const { ccclass, property } = _decorator;

@ccclass('BridgeSegment')
export class BridgeSegment extends Component {
    @property(RigidBody) rigidBody: RigidBody = null;
    @property({ type: Number }) destroyDelay: number = 0.5; // Время до разрушения

    carController: CarController = null

    index: number = null;
    
    private isTriggered: boolean = false;
    private isDestroyed: boolean = false;
    public isWaitDestroyed: boolean = false;

    onLoad() {
        this.rigidBody.type = ERigidBodyType.KINEMATIC;
        const collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onFirstTouch, this);
    }

    onFirstTouch(event: any) {
        if(event.otherCollider.node.name === 'Road_platform') return;

        if(this.isDestroyed && this.carController) this.carController.breakCar()

        if (this.isTriggered) return;
        this.isTriggered = true;

        this.scheduleOnce(() => this.destroySegment(), this.destroyDelay);
    }

    destroySegment() {
        if (this.isWaitDestroyed) return;
        this.isWaitDestroyed = true

        setTimeout(() => this.isDestroyed = true, 200)

        // Активируем физику
        if (isValid(this.rigidBody)) {
            this.rigidBody.type = ERigidBodyType.DYNAMIC;
            this.rigidBody.wakeUp(); // Используем прямой метод
            this.rigidBody.useGravity = true
            this.rigidBody.applyForce(new Vec3(0, -10, 0));
        }

        // Удаление через 5 секунд
        this.scheduleOnce(() => {
            isValid(this.node) && this.node.destroy();
        }, 3);
    }
}