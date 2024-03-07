import { EventEmitter } from 'events';
import { formatValidDatabaseResponseObject } from './FormatValidResponse';
import CommonClass from '../entity/CommonClass';
import IDatabaseResponseObject from './IDiscordDatabaseResponse';

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

    /*
    Implement existing functionality in the Node.js event emitting system
    */
    private constructor() {
        super();
    }

    /**
     * Function should be called by the Database connection manager class whenever any operation occurs on the database. Emits a global event called 'databaseOperationEvent'.
     * @param operation_status_message string that holds a human-readable form of the database operation result.
     * @param operation_status_code optional number that stores the status code of the database operation (e.g. 200, 404, 500, etc.).
     */
    emitDatabaseLoggingMessage(operation_status_message: string, operation_status_code?: number) {
        const show_database_operation_events: IDatabaseResponseObject = formatValidDatabaseResponseObject(operation_status_message, operation_status_code);
        this.emit('databaseOperationEvent', show_database_operation_events);
    }

    /**
     * Function should be called whenever the '/show-command' command is issued on Discord. Emits a global event called 'showClassesInSchedule' if common_classes is defined. 
     * @param common_classes CommonClass[] array of CommonClass objects that will show the user what classes exist in their schedule.
     * @returns nothing if common_classes is undefined.
     */
    emitCommonClassDataMessage(common_classes: CommonClass[] | undefined) {
        if (common_classes === undefined) {
            return;
        }
        this.emit('showClassesInSchedule', common_classes);
    }

    /**
     * Function should be called whenever the '/create-discord-guild-event' command is issued on Discord. This command will create several scheduled guild events in the target
     * Discord server which informs the entire server of what classes are for everybody on that day. Emits a global event called 'createDiscordGuildEvent' if common_classes is
     * defined.
     * @param common_classes CommonClass[] or undefined, depending on if any CommonClass objects can be constructed from the data retrieved from the database.
     * @param day_of_week string value representing the current day of the week. 
     * @returns nothing if common_classes is undefined. 
     */
    emitGuildEventCreationMessage(common_classes: CommonClass[] | undefined) {
        if (common_classes === undefined) {
            return;
        }
        this.emit('createDiscordGuildEvent', common_classes);
    }
}