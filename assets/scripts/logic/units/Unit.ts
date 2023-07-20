import {Prefab, resources} from 'cc';
export abstract class Unit {
    protected abstract readonly prefabPath;
    static prefabs: Map<string, Prefab> = new Map<string, Prefab>();

    loadPrefab(): Promise<Prefab> {
        return new Promise<Prefab>((resolve) => {
            if(!Unit.prefabs.has(this.prefabPath)) {
                resources.load(this.prefabPath, Prefab, (err, prefab) => {
                    Unit.prefabs.set(this.prefabPath, prefab);
                    resolve(prefab);
                });
            } else {
                resolve(Unit.prefabs.get(this.prefabPath));
            }
        });
    }

    mergeClass(): (new (...args) => Unit) | undefined {
        return undefined;
    }
}