import { _decorator, Component, RigidBody, Vec3, Collider, HingeConstraint, ERigidBodyType, MeshRenderer, isValid } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BridgeSegment')
export class BridgeSegment extends Component {
    @property(RigidBody) rigidBody: RigidBody = null;
    @property(HingeConstraint) joint: HingeConstraint = null;
    @property({ type: Number }) destroyDelay: number = 3; // Время до разрушения
    
    private isTriggered: boolean = false;
    private isDestroyed: boolean = false;

    onLoad() {
        const collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onFirstTouch, this);
    }

    onFirstTouch() {
        if (this.isTriggered) return;
        this.isTriggered = true;

        this.scheduleOnce(() => this.destroySegment(), this.destroyDelay);
    }

    destroySegment() {
        if (this.isDestroyed) return;
        console.log(55)
        this.isDestroyed = true;

        // Удаляем соединение
        if (isValid(this.joint)) {
            this.joint.destroy();
            this.joint = null!;
        }

        // Активируем физику
        if (isValid(this.rigidBody)) {
            this.rigidBody.type = ERigidBodyType.DYNAMIC;
            this.rigidBody.wakeUp(); // Используем прямой метод
        }

        // Удаление через 5 секунд
        this.scheduleOnce(() => {
            isValid(this.node) && this.node.destroy();
        }, 5);
    }
}