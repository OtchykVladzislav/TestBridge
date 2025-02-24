import { _decorator, Component, RigidBody, Vec3, Node, Prefab, instantiate, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CarController')
export class CarController extends Component {
    @property(RigidBody) rigidBody: RigidBody = null;
    @property(Prefab) smokePrefab: Prefab = null;
    @property(Node) smokeSpawnPoint: Node = null;
    @property(Number) acceleration: number = 2;
    @property(Number) maxSpeed: number = 10;
    
    private smokeEffect: Node = null;
    private currentSpeed: number = 0;
    private targetSpeed: number = 0;
    private isGrounded: boolean = true;

    start() {
        if (this.smokePrefab) {
            this.smokeEffect = instantiate(this.smokePrefab);
            this.node.addChild(this.smokeEffect);
            this.smokeEffect.setWorldPosition(this.smokeSpawnPoint.worldPosition);
            this.smokeEffect.active = false;
        }
    }

    setSpeed(value: number) {
        this.targetSpeed = math.clamp(value, 0, this.maxSpeed);
    }

    update(deltaTime: number) {
        this.currentSpeed = math.lerp(this.currentSpeed, this.targetSpeed, this.acceleration * deltaTime);
        
        if (this.rigidBody) {
            let velocity = new Vec3();
            this.rigidBody.getLinearVelocity(velocity);
            const newVelocity = new Vec3(this.currentSpeed, velocity.y, 0);
            this.rigidBody.setLinearVelocity(newVelocity);
        }

        this.updateSmokeEffect();
    }

    updateSmokeEffect() {
        if (!this.smokeEffect) return;
        let isMoving = Math.abs(this.currentSpeed) > 0.1;
        this.smokeEffect.active = isMoving && this.isGrounded;
        if (this.smokeEffect.active) {
            this.smokeEffect.setWorldPosition(this.smokeSpawnPoint.worldPosition);
        }
    }
}
