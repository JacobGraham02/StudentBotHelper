import { EventEmitter } from 'events';
import IEventEmitterResponse from './IEventEmitterResponse';

class CustomEventEmitter extends EventEmitter {

    constructor() {
        super();
    }

    emitDatabaseLoggingMessage(database_log: IEventEmitterResponse) {
        this.emit('databaseOperationEvent', database_log.response_json);
    }
}

export default CustomEventEmitter;