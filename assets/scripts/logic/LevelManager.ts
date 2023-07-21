import {Grid} from "db://assets/scripts/logic/Grid";
import {director, instantiate, Node, Prefab, resources} from 'cc';
import {Unit} from "db://assets/scripts/logic/units/Unit";
import {BlueFlowerLevel1} from "db://assets/scripts/logic/units/BlueFlowerLevel1";
import {BlueFlowerLevel2} from "db://assets/scripts/logic/units/BlueFlowerLevel2";
import {GridEvent} from "db://assets/scripts/logic/GridEvent";

class LevelManager {
    grid: Grid;
    tilePrefab?: Prefab;
    tileWidth = 64;
    tileHeight = 64;
    tileMargin = 8;
    canvas: Node;
    unitNodes: WeakMap<Unit, Node> = new WeakMap;

    constructor() {
    }

    init() {
        this.grid = new Grid(5, 5);
        this.canvas = director.getScene().getChildByName('Canvas');

        this.grid.eventManager.on(GridEvent.AddUnit, async (unit: Unit, x: number, y: number) => {
            console.log('add unit');
            const prefab = await unit.loadPrefab();
            const unitNode = instantiate(prefab);
            unitNode.setParent(this.canvas);
            const position = this.convertIndexesToPixels(x, y);
            unitNode.setPosition(
                position.x,
                position.y,
                0
            );
            this.unitNodes.set(unit, unitNode);
        });
        this.grid.eventManager.on(GridEvent.MoveUnit, (unit: Unit, x: number, y: number) => {
            console.log('move unit');
            const position = this.convertIndexesToPixels(x, y);
            this.unitNodes.get(unit).setPosition(
                position.x,
                position.y,
                0
            );
        });
        this.grid.eventManager.on(GridEvent.RemoveUnit, (unit: Unit) => {
            console.log('remove unit');
            this.unitNodes.get(unit)?.destroy();
        });
        this.loadTilePrefab().then(() => {
            for (let i = 0; i < this.grid.width; i++) {
                for (let j = 0; j < this.grid.height; j++) {
                    this.addTile(i, j);
                }
            }
            this.addUnit(BlueFlowerLevel1, 0, 0);
            this.addUnit(BlueFlowerLevel1, 0, 1);
            this.addUnit(BlueFlowerLevel1, 4, 1);
            this.addUnit(BlueFlowerLevel1, 4, 3);
            this.addUnit(BlueFlowerLevel2, 3, 3);
            this.addUnit(BlueFlowerLevel2, 0, 3);
        });
    }


    async addUnit(unitClass: (new (...args) => Unit), x: number, y: number) {
        const unit = new unitClass;
        this.grid.addUnit(unit, x, y);
    }

    async addTile(x: number, y: number) {
        const tile = instantiate(this.tilePrefab);
        tile.setParent(this.canvas);
        tile.setSiblingIndex(0);
        const position = this.convertIndexesToPixels(x, y);
        tile.setPosition(
            position.x,
            position.y,
            0);
    }

    convertIndexesToPixels(x: number, y: number) {
        // Конвертация из индексной системы в пиксельную
        return {
            x: x * this.tileWidth - ((this.grid.width * this.tileWidth) / 2) + (this.tileMargin * x),
            y: y * this.tileHeight - ((this.grid.height * this.tileHeight) / 2) + (this.tileMargin * y)
        }
    }

    convertPixelsToIndexes(x: number, y: number) {
        for (let i = 0; i < this.grid.width; i++) {
            for (let j = 0; j < this.grid.height; j++) {
                const position = this.convertIndexesToPixels(i, j);
                if(
                    x >= position.x - (this.tileWidth / 2)
                    &&
                    x <= position.x + (this.tileWidth / 2)
                    &&
                    y >= position.y - (this.tileHeight / 2)
                    &&
                    y <= position.y + (this.tileHeight / 2)
                ) {
                    return {
                        x: i,
                        y: j
                    }
                }
            }
        }
    }

    loadTilePrefab() {
        return new Promise<void>((resolve) => {
            if (!this.tilePrefab) {
                resources.load('prefabs/Tile', Prefab, (err, prefab) => {
                    this.tilePrefab = prefab;
                    resolve();
                });
            } else {
                resolve();
            }

        });
    }
}

export const levelManager = new LevelManager();