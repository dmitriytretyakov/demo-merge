export class EventManager<EventType> {
    private listeners: Map<EventType, Function[]> = new Map;

    emit(event: EventType, ...args) {
        if(this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => {
                cb(...args);
            })
        }
    }
    on(event: EventType, cb: Function) {
        if(!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        const listeners = this.listeners.get(event);
        listeners.push(cb);
        this.listeners.set(event, listeners);
    }
}