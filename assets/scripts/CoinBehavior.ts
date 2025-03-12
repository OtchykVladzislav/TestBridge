import { _decorator, Collider, Component, Node, RigidBody, tween, Vec3 } from 'cc';
import { CoinCounter } from './CoinCounter';
const { ccclass, property } = _decorator;

@ccclass('CoinBehavior')
export class CoinBehavior extends Component {
    @property(Collider)
    collider: Collider = null;

    @property(Number)
    rotationSpeed: number = 180; // Градусов в секунду

    coinsCounter: CoinCounter = null;

    collected: boolean = false

    protected onLoad(): void {
        this.collider?.on('onTriggerEnter', this.onCollision, this);
    }

    onCollision(event: any){
        if(this.collected) return;
        this.collected = true

        this.coinsCounter.increaseCoins(this.node.worldPosition.clone())

        tween(this.node)
        .to(0.2, {scale: new Vec3(0, 0, 0)})
        .call(() => {
            if(this.node) this.node.destroy()
        })
        .start()
    }

    update(deltaTime: number) {
        const currentRotation = this.node.eulerAngles;
        this.node.setRotationFromEuler(
            currentRotation.x,
            currentRotation.y + this.rotationSpeed * deltaTime,
            currentRotation.z
        );
    }


}


