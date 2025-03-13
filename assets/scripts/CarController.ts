import { _decorator, Component, RigidBody, Vec3, Node, Prefab, instantiate, math, Quat, HingeConstraint, input, Input, KeyCode, Collider, director, view, BoxCollider, CylinderCollider } from 'cc';
import { physics } from 'cc';
import { GameController } from './GameController';
const FixedConstraint = physics.FixedConstraint;
const { ccclass, property } = _decorator;

@ccclass('CarController')
export class CarController extends Component {
    @property(GameController) gameController: GameController = null;
    @property(Node) camera: Node = null;
    @property(Prefab) explodeBody: Prefab = null;
    @property([RigidBody]) wheels: RigidBody[] = [];
    @property(Number) acceleration: number = 10;
    @property(Number) maxSpeed: number = 50;
    @property(Node) propeller: Node = null;
    
    private currentSpeed: number = 0;
    private targetSpeed: number = 0;
    private initialCameraOffsetX: number = 0;
    private destroyed: boolean = false

    start() {
        // Сохраняем начальное смещение камеры относительно машинки
        if (this.camera && this.node) {
            const cameraPos = this.camera.worldPosition;
            const carPos = this.node.worldPosition;
            this.initialCameraOffsetX = cameraPos.x - carPos.x;
        }
    }

    setSpeed(value: number) {
        this.targetSpeed = math.clamp(value, 0, this.maxSpeed);
    }

    update(deltaTime: number) {
        if(this.destroyed) return;

        this.currentSpeed = math.lerp(this.currentSpeed, this.targetSpeed, this.acceleration * deltaTime);
    
        this.wheels.map(e => { 
            e.applyTorque(new Vec3(0, 0, -this.currentSpeed))
            //this.rotateWheel(e.node)
        })

        if(this.wheels[0].node.worldPosition.y < -5) this.breakCar()

        if(!this.destroyed) this.moveCamera(deltaTime)

        this.rotatePropeller()
    }

    moveCamera(deltaTime: number) {
        if (!this.camera) return;
    
        // 1. Текущая позиция машинки
        const carPosX = this.node.children[1].worldPosition.x;

        // 2. Целевая позиция камеры с учетом начального смещения
        const targetCameraX = carPosX + this.initialCameraOffsetX;

        // 3. Текущая позиция камеры
        const currentCameraPos = this.camera.worldPosition;

        // 4. Плавная интерполяция с "запаздывающим" эффектом
        const lerpFactor = 3; // Уменьшаем для большей плавности
        const lerpDelta = lerpFactor * deltaTime;
        const newX = this.lerp(currentCameraPos.x, targetCameraX, lerpDelta);
    
        // 4. Сохраняем исходные Y и Z
        this.camera.setWorldPosition(
            newX, 
            currentCameraPos.y, 
            currentCameraPos.z
        );
    }

    private lerp(start: number, end: number, t: number): number {
        return (1 - t) * start + t * end;
    }

    rotateWheel(e: Node) {
        // Скорость вращения (в радианах)
        const rotationSpeed = this.currentSpeed * Math.PI / 180; 
        
        // Создаем кватернион вращения вокруг оси Z
        const deltaRotation = Quat.fromAxisAngle(new Quat(), Vec3.FORWARD, rotationSpeed);
        
        // Получаем текущую глобальную ротацию
        const currentRotation = e.worldRotation.clone();
        
        // Применяем вращение
        Quat.multiply(currentRotation, currentRotation, deltaRotation);
        
        // Устанавливаем новую ротацию
        e.setWorldRotation(currentRotation);
    }

    rotatePropeller() {
        if(!this.propeller) return;

        let rotationSpeed = this.currentSpeed; // Скорость вращения
        let deltaRotation = Quat.fromAxisAngle(new Quat(), Vec3.RIGHT, rotationSpeed * Math.PI / 180);

        let currentRotation = this.propeller.worldRotation.clone();
        Quat.multiply(currentRotation, currentRotation, deltaRotation);

        this.propeller.setWorldRotation(currentRotation);
    }

    copyChildrenTransforms(sourceParent: Node, targetParent: Node) {
        // Проверяем одинаковое количество детей
        if (sourceParent.children.length !== targetParent.children.length) {
            console.error("Объекты имеют разное количество дочерних элементов!");
            return;
        }
    
        // Копируем трансформации для каждого ребёнка
        for (let i = 0; i < sourceParent.children.length; i++) {
            const sourceChild = sourceParent.children[i];
            const targetChild = targetParent.children[i];
    
            // Копируем позицию, поворот и масштаб
            targetChild.position = sourceChild.position.clone();
            targetChild.rotation = sourceChild.rotation.clone();
            targetChild.scale = sourceChild.scale.clone();
        }
    }

    breakCar() {
        if(this.destroyed) return;

        this.destroyed = true

        this.gameController.transferToCTA()

        const object = instantiate(this.explodeBody)

        this.copyChildrenTransforms(this.node, object);

        const parent = this.node.parent;
        parent?.addChild(object);
        this.node.destroy();
    }
}
