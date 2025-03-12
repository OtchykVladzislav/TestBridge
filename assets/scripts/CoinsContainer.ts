import { _decorator, Camera, CCInteger, Component, instantiate, Node, Prefab } from 'cc';
import { CoinBehavior } from './CoinBehavior';
import { CoinCounter } from './CoinCounter';
const { ccclass, property } = _decorator;

@ccclass('CoinsContainer')
export class CoinsContainer extends Component {
    @property(Number)coinVerticalOffset: number = 2; // Смещение монетки над балкой
    @property(Prefab) coinPrefab: Prefab = null; // Префаб монетки
    @property(Camera) mainCamera: Camera = null;
    @property(CCInteger) coinCount: number = 10;
    @property(Node) bridgeController: Node = null;
    @property(CoinCounter) coinsCounter: CoinCounter = null;

    private coins: Node[] = []; // Массив созданных монеток

    start() {
        this.distributeCoins(this.coinCount)
    }

    distributeCoins(totalCoins: number) {
        const totalSegments = this.bridgeController.children.length;
        const step = totalSegments / (totalCoins + 1);
        
        for (let i = 1; i <= totalCoins; i++) {
            const index = Math.round(i * step);
            if (index < totalSegments) {
                this.createCoinAboveSegment(this.bridgeController.children[index]);
            }
        }
    }

    private createCoinAboveSegment(segment: Node) {
        if (!this.coinPrefab) return;
    
        const coin = instantiate(this.coinPrefab);

        coin.getComponent(CoinBehavior).coinsCounter = this.coinsCounter

        this.node.addChild(coin);
        
        // Позиционируем над сегментом
        const segmentPos = segment.getWorldPosition();
        coin.setWorldPosition(
            segmentPos.x,
            segmentPos.y + this.coinVerticalOffset,
            segmentPos.z
        );
        
        this.coins.push(coin);
    }
}


