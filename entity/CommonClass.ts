import { UUID } from "crypto";

export default class CommonClass {
    private id: UUID;
    private class_name: string;
    private class_start_time: string;
    private class_end_time: string; 
    private class_course_code = 0;

    private class_name_regex = /[a-zA-Z ]{1,100}/

    constructor(id: UUID, class_start_time: string, class_end_time: string, class_course_code: number,  class_name: string) {
        this.validateClassName(class_name);
        this.id = id;
        this.class_name = class_name;
        this.class_start_time = class_start_time;
        this.class_end_time = class_end_time;
        this.class_course_code = class_course_code;
    }

    private validateClassName(class_name: string): void {
        if (!class_name.match(this.class_name_regex)) {
            throw new Error('The supplied class name is invalid: Must contain between 1 and 100 lowercase and uppercase letters');
        }
    }

    public commonClassInformation() {
        return {
            class_id: this.id,
            class_name: this.class_name,
            class_start_time: this.class_start_time,
            class_end_time: this.class_end_time,
            class_course_code: this.class_course_code
        };
    }

    private validateTimeFormat(time: string): void {
        const timeRegex = /(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d/g;
        if (!time.match(timeRegex)) {
            throw new Error('Invalid time format. Class start and end times must be in the format HH:MM:SS');
        }
    }
}
