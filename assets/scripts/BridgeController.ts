import { _decorator, Component, Node, instantiate, Prefab, Vec3, RigidBody, math, HingeConstraint, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BridgeController')
export class BridgeController extends Component {
    @property(Prefab) bridgeSegmentPrefab: Prefab = null;
    @property(Number) segmentCount: number = 150;
    @property(Number) segmentSpacing: number = 1;
    @property(Number) waveAmplitude: number = 1;
    @property(Number) primaryWaveFrequency: number = 0.2; // Низкая частота для плавности
    @property(Number) secondaryWaveAmplitude: number = 0.3; // Амплитуда вторичной волны
    @property(Number) secondaryWaveFrequency: number = 0.05;
    @property(Node) secondRoad: Node = null;

    public segments: Node[] = [];

    start() {
        this.buildBridge();

        const distance = (this.node.children[this.node.children.length - 2].position.x * 1.25) - this.node.position.x

        this.secondRoad.setPosition(this.secondRoad.position.x + distance, this.secondRoad.position.y, this.secondRoad.position.z)
    }

    buildBridge() {
        let prevSegment: Node = null;
        for (let i = 0; i < this.segmentCount; i++) {
            let segment = instantiate(this.bridgeSegmentPrefab);
            this.node.addChild(segment);

            let x = i * this.segmentSpacing;
            const primaryWave = Math.sin(i * this.primaryWaveFrequency) * this.waveAmplitude;
            
            // Вторичная медленная волна для изменения размера
            const sizeVariation = 1 + Math.sin(i * this.secondaryWaveFrequency) * this.secondaryWaveAmplitude;
            
            // Комбинированная высота
            const y = primaryWave * sizeVariation;

            segment.setPosition(new Vec3(x, y, segment.position.z));
            
            if (prevSegment) {
                let joint = segment.addComponent(HingeConstraint);
                joint.connectedBody = prevSegment.getComponent(RigidBody);
            }

            this.segments.push(segment);
            prevSegment = segment;
        }
    }

    destroyBridgeSegment(index: number) {
        if (index >= 0 && index < this.segments.length) {
            let segment = this.segments[index];
            this.segments.splice(index, 1);
            segment.destroy();
        }
    }
}
