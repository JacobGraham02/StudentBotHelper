import { EventEmitter } from 'events';
import { formatValidDatabaseResponseObject } from './FormatValidResponse';
import CommonClass from '../entity/CommonClass';

export default class CustomEventEmitter extends EventEmitter {
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

    
    emitDatabaseLoggingMessage(operation_status_message: string, operation_status_code?: number) {
        const show_database_operation_events = formatValidDatabaseResponseObject(operation_status_message, operation_status_code);
        this.emit('databaseOperationEvent', show_database_operation_events);
    }


    emitCommonClassDataMessage(common_classes: CommonClass[] | undefined) {
        if (common_classes === undefined) {
            return;
        }
        this.emit('showClassesInSchedule', common_classes);
    }


    emitGuildEventCreationMessage(common_classes: CommonClass[] | undefined) {
        if (common_classes === undefined) {
            return;
        }
        this.emit('createDiscordGuildEvent', common_classes);
    }
}