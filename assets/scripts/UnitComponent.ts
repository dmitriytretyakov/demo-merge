import { _decorator, Component, Node, Vec3, EventTouch, Input } from 'cc';
import {levelManager} from "db://assets/scripts/logic/LevelManager";
const { ccclass, property } = _decorator;

@ccclass('Unit')
export class UnitComponent extends Component {
    movementStartPositionX!: number;
    movementStartPositionY!: number;
    start() {

    }

    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this.movementStartPositionX = this.node.position.x;
        this.movementStartPositionY = this.node.position.y;
    }

    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        this.node.setWorldPosition(new Vec3(pos.x, pos.y, 0));
    }

    onTouchEnd(event: EventTouch) {
        const positionInGrid = levelManager.convertPixelsToIndexes(this.node.position.x, this.node.position.y);
        if(positionInGrid) {
            const startPositionInGrid = levelManager.convertPixelsToIndexes(this.movementStartPositionX, this.movementStartPositionY);
            if(positionInGrid.x !== startPositionInGrid.x || positionInGrid.y !== startPositionInGrid.y) {
                try {
                    levelManager.grid.moveUnit(startPositionInGrid.x, startPositionInGrid.y, positionInGrid.x, positionInGrid.y);
                } catch {
                    this.node.setWorldPosition(new Vec3(event.getUIStartLocation().x, event.getUIStartLocation().y, 0));
                }
            } else {
                this.node.setWorldPosition(new Vec3(event.getUIStartLocation().x, event.getUIStartLocation().y, 0));
            }
        }
        else {
            this.node.setWorldPosition(new Vec3(event.getUIStartLocation().x, event.getUIStartLocation().y, 0));
        }
    }

    update(deltaTime: number) {
        
    }
}

