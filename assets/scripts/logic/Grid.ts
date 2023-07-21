import {Unit} from "db://assets/scripts/logic/units/Unit";
import {EventManager} from "db://assets/scripts/logic/EventManager";
import {GridEvent} from "db://assets/scripts/logic/GridEvent";

export class Grid {
    readonly eventManager: EventManager<GridEvent> = new EventManager<GridEvent>();
    private readonly tiles: Array<
        Array<{
            unit?: Unit
        }>
    >;

    constructor(readonly width: number, readonly height: number) {
        this.tiles = new Array(width);
        for (let i = 0; i < width; i++) {
            this.tiles[i] = new Array(height);
            for (let j = 0; j < height; j++) {
                this.tiles[i][j] = {
                    unit: undefined
                };
            }
        }
    }

    getNeighborPositions(x: number, y: number): {x: number, y: number}[] {
        const result = [];
        const candidates = [
            { x: x - 1, y: y },
            { x: x - 1, y: y - 1 },
            { x: x, y: y - 1 },
            { x: x + 1, y: y - 1 },
            { x: x + 1, y: y },
            { x: x + 1, y: y + 1 },
            { x: x, y: y + 1 },
            { x: x - 1, y: y + 1 },
        ];
        candidates.forEach(candidate => {
            if(
                candidate.x >= 0 && candidate.x < this.width
                &&
                candidate.y >= 0 && candidate.y < this.height
            ) {
                result.push(candidate);
            }
        })
        return result;
    }

    getUnit(x: number, y: number): Unit | undefined {
        return this.tiles[x][y].unit;
    }

    removeUnit(x: number, y: number, emitEvent = true) {
        const unit = this.tiles[x][y].unit;
        delete this.tiles[x][y].unit;
        if(emitEvent) {
            this.eventManager.emit(GridEvent.RemoveUnit, unit, x, y);
        }
    }

    addUnit(unit: Unit, x: number, y: number, emitEvent = true) {
        if(this.tiles[x][y].unit) {
            throw new Error(`Tile ${x}; ${y} already has unit`);
        }
        this.tiles[x][y].unit = unit;
        if(emitEvent) {
            this.eventManager.emit(GridEvent.AddUnit, unit, x, y);
        }
    }

    moveUnit(from_x: number, from_y: number, to_x: number, to_y: number) {
        const start_unit = this.getUnit(from_x, from_y);
        const finish_unit = this.getUnit(to_x, to_y);
        if(!start_unit) {
            throw new Error(`Tile ${from_x}; ${from_y} doesn't have unit`);
        }
        if(!finish_unit) {
            this.addUnit(start_unit, to_x, to_y, false);
            this.removeUnit(from_x, from_y, false);
            this.eventManager.emit(GridEvent.MoveUnit, start_unit, to_x, to_y);
        } else {
            // Юнит в конечной точке есть
            if(start_unit.constructor === finish_unit.constructor && start_unit.mergeClass()) {
                // Одинаковые юниты, нужен merge если он доступен
                this.removeUnit(from_x, from_y);
                this.removeUnit(to_x, to_y);
                this.addUnit(new (start_unit.mergeClass()), to_x, to_y);
            } else {
                // Разные юниты, одного нужно переместить на соседнюю клетку
                let position_for_moving;
                this.getNeighborPositions(to_x, to_y).every(position => {
                    if (!this.getUnit(position.x, position.y)) {
                        // Если найдена пустая соседняя клетка
                        position_for_moving = position;
                        return false;
                    }
                    return true;
                });
                if (!position_for_moving) {
                    throw new Error('Нет свободной клетки для перемещения');
                } else {
                    // Перемещаем юнита на соседнюю клетку и запускаем метод заново
                    this.moveUnit(to_x, to_y, position_for_moving.x, position_for_moving.y);
                    this.moveUnit(from_x, from_y, to_x, to_y);
                }
            }
        }
    }
}