import { _decorator, Component, RigidBody, Vec3, Collider, HingeConstraint } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BridgeSegment')
export class BridgeSegment extends Component {
    @property(RigidBody) rigidBody: RigidBody = null;
    @property(HingeConstraint) joint: HingeConstraint = null;
    @property({ type: Number }) breakThreshold: number = 5; // Порог разрушения

    private isBroken: boolean = false;

    onLoad() {
        const collider = this.getComponent(Collider);
        if (collider) {
            collider.on('onCollisionEnter', this.onCollision, this);
        }
    }

    onCollision(event: any) {
        if (this.isBroken) return;

        const impactForce = event.otherCollider.getComponent(RigidBody)?.getLinearVelocity().length() || 0;
        if (impactForce > this.breakThreshold) {
            this.breakSegment();
        }
    }

    breakSegment() {
        if (this.isBroken) return;
        this.isBroken = true;

        if (this.joint) {
            this.joint.destroy(); // Разрываем соединение
        }

        this.rigidBody.applyImpulse(new Vec3(Math.random() * 2 - 1, 2, Math.random() * 2 - 1)); // Разбрасываем обломки
    }
}
