import {Unit} from "db://assets/scripts/logic/units/Unit";
import {BlueFlowerLevel2} from "db://assets/scripts/logic/units/BlueFlowerLevel2";

export class BoxWithBonusLevel1 extends Unit {
    prefabPath = 'prefabs/units/Box With Bonus Level 1';
    mergeClass(): { new(...args): Unit } | undefined {
        alert('Поздравляю, Вы прошли игру!')
        return undefined;
    }
}