import { _decorator, Component, Node } from 'cc';
import {levelManager} from "db://assets/scripts/logic/LevelManager";
const { ccclass, property } = _decorator;

@ccclass('InitLevelComponent')
export class InitLevelComponent extends Component {
    start() {
        levelManager.init();
    }

    update(deltaTime: number) {
        
    }
}

