import { _decorator, Component, Node, instantiate, Prefab, Vec3, RigidBody, math, HingeConstraint, Camera, isValid } from 'cc';
import { BridgeSegment } from './BridgeSegment';
import { CarController } from './CarController';
const { ccclass, property } = _decorator;

@ccclass('BridgeController')
export class BridgeController extends Component {
    @property(CarController) carController: CarController = null;
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
        let startIndex: number = Math.floor(this.segmentCount * 0.7);

        for (let i = 0; i < this.segmentCount; i++) {
            let segment = instantiate(this.bridgeSegmentPrefab);
            this.node.addChild(segment);

            let component = segment.getComponent(BridgeSegment)

            let x = i * this.segmentSpacing;
            const primaryWave = Math.sin(i * this.primaryWaveFrequency) * this.waveAmplitude;
            
            // Вторичная медленная волна для изменения размера
            const sizeVariation = 1 + Math.sin(i * this.secondaryWaveFrequency) * this.secondaryWaveAmplitude;
            
            // Комбинированная высота
            const y = primaryWave * sizeVariation;

            segment.setPosition(new Vec3(x, y, segment.position.z));

            if(startIndex <= i){
                component.destroyDelay = 0
            }

            component.carController = this.carController

            this.segments.push(segment);
        }
    }

    update(dt: number): void {
        this.checkSegments()
    }

    checkSegments(){
        let segments_component = this.segments.map(e => {if(isValid(e)) return e.getComponent(BridgeSegment)}).reverse()
        let check_status = false

        for(let i = 0; i < segments_component.length; i++){
            let elem = segments_component[i]

            if(elem){
                if(elem.isWaitDestroyed && !check_status) check_status = true

                if(check_status && !elem.isWaitDestroyed){
                    elem.destroySegment()
                }
            }            
        }
    }

}
