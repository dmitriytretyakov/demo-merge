import {Unit} from "db://assets/scripts/logic/units/Unit";
import {BoxWithBonusLevel1} from "db://assets/scripts/logic/units/BoxWithBonusLevel1";

export class BlueFlowerLevel2 extends Unit {
    prefabPath = 'prefabs/units/Blue Flower Level 2';

    mergeClass(): { new(...args): Unit } | undefined {
        return BoxWithBonusLevel1;
    }
}