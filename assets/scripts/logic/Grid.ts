import {Unit} from "db://assets/scripts/logic/units/Unit";

export class Grid {
    private readonly tiles: Array<
        Array<{
            unit?: Unit
        }>
    >;

    constructor(private width: number, private height: number) {
        this.tiles = new Array(width);
        for (let i = 0; i < width; i++) {
            this.tiles[i] = new Array(height);
            for (let j = 0; j < height; i++) {
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

    removeUnit(x: number, y: number) {
        delete this.tiles[x][y].unit;
    }

    addUnit(unit: Unit, x: number, y: number) {
        if(this.tiles[x][y].unit) {
            throw new Error(`Tile ${x}; ${y} already has unit`);
        }
        this.tiles[x][y].unit = unit;
    }

    moveUnit(from_x: number, from_y: number, to_x: number, to_y: number) {
        const unit = this.getUnit(from_x, from_y);
        if(unit) {
            this.addUnit(unit, to_x, to_y);
            this.removeUnit(from_x, from_y);
        } else {
            throw new Error(`Tile ${from_x}; ${from_y} doesn't have unit`);
        }
    }
}