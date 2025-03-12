import { _decorator, Component, RigidBody, Vec3, Node, Prefab, instantiate, math, Quat, HingeConstraint, input, Input, KeyCode } from 'cc';
import { physics } from 'cc';
const FixedConstraint = physics.FixedConstraint;
const { ccclass, property } = _decorator;

@ccclass('CarController')
export class CarController extends Component {
    @property(Node) camera: Node = null;
    @property([RigidBody]) wheels: RigidBody[] = [];
    @property(Number) acceleration: number = 10;
    @property(Number) maxSpeed: number = 50;
    @property(Node) propeller: Node = null;
    
    private currentSpeed: number = 0;
    private targetSpeed: number = 0;
    private initialCameraOffsetX: number = 0;

    start() {
        // Сохраняем начальное смещение камеры относительно машинки
        if (this.camera && this.node) {
            const cameraPos = this.camera.worldPosition;
            const carPos = this.node.worldPosition;
            this.initialCameraOffsetX = cameraPos.x - carPos.x;
        }

        input.on(Input.EventType.KEY_DOWN, (event: any) => {
            console.log(event)
            if (event.keyCode === KeyCode.KEY_R) { // R - разрушить
                this.breakCar();
            }
        });
    }

    setSpeed(value: number) {
        this.targetSpeed = math.clamp(value, 0, this.maxSpeed);
    }

    update(deltaTime: number) {
        this.currentSpeed = math.lerp(this.currentSpeed, this.targetSpeed, this.acceleration * deltaTime);
    
        this.wheels.map(e => { 
            e.applyTorque(new Vec3(0, 0, -this.currentSpeed))
        })

        this.moveCamera(deltaTime)

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

    rotatePropeller() {
        if(!this.propeller) return;

        let rotationSpeed = this.currentSpeed; // Скорость вращения
        let deltaRotation = Quat.fromAxisAngle(new Quat(), Vec3.RIGHT, rotationSpeed * Math.PI / 180);

        let currentRotation = this.propeller.worldRotation.clone();
        Quat.multiply(currentRotation, currentRotation, deltaRotation);

        this.propeller.setWorldRotation(currentRotation);
    }

    breakCar() {
        // 1. Разрываем все HingeConstraint
        const hinges = this.getComponentsInChildren(HingeConstraint);

        for (const hinge of hinges) {
            hinge.destroy();
        }

        // 2. Разрываем все FixedConstraint
        const fixedConstraints = this.getComponentsInChildren(FixedConstraint);
        for (const fc of fixedConstraints) {
            fc.destroy()
        }

        //3. Убираем заморозку осей для всех частей
        const rigidbodies = this.getComponentsInChildren(RigidBody);
        for (const rb of rigidbodies) {
            rb.wakeUp() // Разрешаем вращение по всем осям
        }
    }
}
