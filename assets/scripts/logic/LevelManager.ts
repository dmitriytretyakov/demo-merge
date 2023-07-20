import {Unit} from "db://assets/scripts/logic/units/Unit";
import {Grid} from "db://assets/scripts/logic/Grid";

export class LevelManager {
    readonly grid: Grid;

    constructor() {
        this.grid = new Grid(3, 2);
    }

    init() {

    }

    move(from_x: number, from_y: number, to_x: number, to_y: number) {
        const unit_to = this.grid.getUnit(to_x, to_y);
        if(!unit_to) {
            // Клетка пустая
            this.grid.moveUnit(from_x, from_y, to_x, to_y);
        } else {
            const unit_from = this.grid.getUnit(from_x, from_y);
            if(unit_from.constructor === unit_to.constructor) {
                // Если типы юнитов совпадают
                const merge_unit_class = unit_from.mergeClass();
                if(merge_unit_class) {
                    this.grid.removeUnit(from_x, from_y);
                    this.grid.removeUnit(to_x, to_y);
                    this.grid.addUnit(new merge_unit_class, to_x, to_y);
                } else {
                    // если объекты не объединяются
                    alert('Ну зачем объединять необъединяемое?');
                }
            } else {
                // Типы юнитов не совпадают, нужно перемещать на соседнюю
                let position_for_moving;
                this.grid.getNeighborPositions(to_x, to_y).every(position => {
                   if(!this.grid.getUnit(position.x, position.y)) {
                       // Если найдена пустая соседняя клетка
                       position_for_moving = position;
                       return false;
                   }
                });
                if(!position_for_moving) {
                    alert('Нормально же общались, это работает только с тремя юнитами на сетке');
                } else {
                    this.grid.moveUnit(to_x, to_y, position_for_moving.x, position_for_moving.y);
                    this.grid.moveUnit(from_x, from_y, to_x, to_y);
                }
            }
        }
    }
}