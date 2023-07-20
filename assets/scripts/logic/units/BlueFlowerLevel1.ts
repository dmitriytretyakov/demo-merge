import {Unit} from "db://assets/scripts/logic/units/Unit";
import {BlueFlowerLevel2} from "db://assets/scripts/logic/units/BlueFlowerLevel2";

export class BlueFlowerLevel1 extends Unit {
    prefabPath = 'prefabs/units/BlueFlowerLevel1';

    mergeClass(): { new(...args): Unit } | undefined {
        return BlueFlowerLevel2;
    }
}