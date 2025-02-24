import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { CarController } from './CarController';
import { BridgeController } from './BridgeController';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Prefab) carPrefab: Prefab = null;
    @property(Prefab) bridgePrefab: Prefab = null;
    @property(Node) carStartPosition: Node = null;
    @property(Node) bridgeStartPosition: Node = null;

    private car: Node = null;
    private bridge: Node = null;
    private carController: CarController = null;
    private bridgeController: BridgeController = null;

    start() {
        this.spawnBridge();
        this.spawnCar();
    }

    spawnBridge() {
        this.bridge = instantiate(this.bridgePrefab);
        this.node.addChild(this.bridge);
        this.bridge.setPosition(this.bridgeStartPosition.position);
        this.bridgeController = this.bridge.getComponent(BridgeController);
    }

    spawnCar() {
        this.car = instantiate(this.carPrefab);
        this.node.addChild(this.car);
        this.car.setPosition(this.carStartPosition.position);
        this.carController = this.car.getComponent(CarController);
    }

    update(deltaTime: number) {
        if (this.carController && this.bridgeController) {
            this.checkBridgeCollapse();
        }
    }

    checkBridgeCollapse() {
        const carPos = this.car.position;
        const segmentIndex = Math.floor(carPos.x / this.bridgeController.segmentSpacing);
        
        if (segmentIndex < this.bridgeController.segments.length) {
            this.bridgeController.destroyBridgeSegment(segmentIndex);
        }

        if (this.car.position.y < -5) {
            console.log('end')
            //this.restartGame();
        }
    }

    restartGame() {
        this.car.destroy();
        this.bridge.destroy();
        this.scheduleOnce(() => {
            this.spawnBridge();
            this.spawnCar();
        }, 1);
    }
}
