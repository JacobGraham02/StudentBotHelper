export default class CommonClass {
    private id?: number;
    private class_name: string;
    private class_start_time: Date;
    private class_end_time: Date; 
    private class_course_code = 0;

    private class_name_regex = /[a-zA-Z ]{1,100}/

    constructor(class_name: string, class_start_time: Date, class_end_time: Date, class_course_code: number, id?: number) {
        this.validateClassName(class_name);
        this.validateClassTime(class_start_time);
        this.validateClassTime(class_end_time);
        if (id !== undefined) {
            this.id = id;
        }
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

    private validateClassTime(class_time: Date): void {
        if (!isNaN(class_time.getTime())) {
            throw new Error('The supplied class time is invalid: Must be a valid date');
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
}
