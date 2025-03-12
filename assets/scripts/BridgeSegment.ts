import { _decorator, Component, RigidBody, Vec3, Collider, HingeConstraint, ERigidBodyType, MeshRenderer, isValid } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BridgeSegment')
export class BridgeSegment extends Component {
    @property(RigidBody) rigidBody: RigidBody = null;
    @property({ type: Number }) destroyDelay: number = 0.5; // Время до разрушения

    index: number = null;
    
    private isTriggered: boolean = false;
    private isDestroyed: boolean = false;

    onLoad() {
        this.rigidBody.type = ERigidBodyType.KINEMATIC;
        const collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onFirstTouch, this);
    }

    onFirstTouch(event: any) {
        if(event.otherCollider.node.name === 'Road_platform') return;
        if (this.isTriggered) return;
        this.isTriggered = true;

        this.scheduleOnce(() => this.destroySegment(), this.destroyDelay);
    }

    destroySegment() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;

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