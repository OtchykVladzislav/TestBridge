import { _decorator, Component, Node, instantiate, Prefab, Vec3, RigidBody, math, HingeConstraint } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BridgeController')
export class BridgeController extends Component {
    @property(Prefab) bridgeSegmentPrefab: Prefab = null;
    @property(Number) segmentCount: number = 10;
    @property(Number) segmentSpacing: number = 2;
    @property(Number) waveAmplitude: number = 1;
    @property(Number) waveFrequency: number = 1;
    @property(Number) randomFactor: number = 0.5;

    public segments: Node[] = [];

    start() {
        this.buildBridge();
    }

    buildBridge() {
        let prevSegment: Node = null;
        for (let i = 0; i < this.segmentCount; i++) {
            let segment = instantiate(this.bridgeSegmentPrefab);
            this.node.addChild(segment);

            let x = i * this.segmentSpacing;
            let y = Math.sin(i * this.waveFrequency) * this.waveAmplitude;
            let z = Math.cos(i * this.waveFrequency) * this.waveAmplitude;

            y += math.randomRange(-this.randomFactor, this.randomFactor);
            z += math.randomRange(-this.randomFactor, this.randomFactor);

            segment.setPosition(new Vec3(x, y, z));
            
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
