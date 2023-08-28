import { EventEmitter } from 'events';
import Student from '../entity/Student';
import formatValidDatabaseResponseObject from './FormatValidResponse';

class CustomEventEmitter extends EventEmitter {
    private static event_emitter_instance: CustomEventEmitter;

    /**
     * Implementation of singleton pattern to make use of globally-accessible data cache
     * @returns Cache
     */
    public static getCustomEventEmitterInstance(): CustomEventEmitter {
        if (!CustomEventEmitter.event_emitter_instance) {
            CustomEventEmitter.event_emitter_instance = new CustomEventEmitter();
        }
        return CustomEventEmitter.event_emitter_instance;
    }

    private constructor() {
        super();
    }

    emitDatabaseLoggingMessage(operation_status_code: number, operation_status_message: string, user_data?: Student) {
        const database_result_object = formatValidDatabaseResponseObject(operation_status_code, operation_status_message, user_data);
        this.emit('databaseOperationEvent', database_result_object);
    }
}

export default CustomEventEmitter;