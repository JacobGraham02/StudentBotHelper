import { UUID } from "crypto";

export default class CommonClass {
    private id: UUID;
    private class_name: string;
    private class_start_time: string;
    private class_end_time: string; 
    private class_course_code: string = "0";
    private class_runs_monday: number;
    private class_runs_tuesday: number;
    private class_runs_wednesday: number;
    private class_runs_thursday: number;
    private class_runs_friday: number;

    private class_name_regex = /[a-zA-Z ]{1,100}/

    constructor(id: UUID, class_start_time: string, class_end_time: string, class_course_code: string,  class_name: string, class_monday, class_tuesday, class_wednesday, 
        class_thursday, class_friday) {
        this.validateClassNameBetween1And100Letters(class_name);
        this.id = id;
        this.class_name = class_name;
        this.class_start_time = class_start_time;
        this.class_end_time = class_end_time;
        this.class_course_code = class_course_code;
        this.class_runs_monday = class_monday;
        this.class_runs_tuesday = class_tuesday;
        this.class_runs_wednesday = class_wednesday;
        this.class_runs_thursday = class_thursday;
        this.class_runs_friday = class_friday;
    }

    /**
     * This function is used to return a boolean value indicating whether a Discord scheduled guild event will be created for the class in question.
     * A for statement is issued, testing to see if a CommonClass instance runs on the day.  
     * @param day_of_week string value that indicates the current day of week. Currently, Saturday and Sunday are used for rest days.
     * @returns a boolean value indicating whether the current CommonClass runs on the specified day_of_week
     */
    public does_class_run_on_day(day_of_week: string): boolean {
        switch (day_of_week.toLowerCase()) {
            case 'monday':
                return this.class_runs_monday === 1;
                break;
            case 'tuesday':
                return this.class_runs_tuesday === 1;
                break;
            case "wednesday":
                return this.class_runs_wednesday === 1;
                break;
            case 'thursday':
                return this.class_runs_thursday === 1;
                break;
            case "friday":
                return this.class_runs_friday === 1;
                break;
            default:
                return false;
        }
    }

    /**
     * Validates that the class name matches the regex pattern: /[a-zA-Z ]{1,100}/
     * @param class_name 
     */
    private validateClassNameBetween1And100Letters(class_name: string): void {
        if (!class_name.match(this.class_name_regex)) {
            throw new Error('The supplied class name is invalid: Must contain between 1 and 100 lowercase and uppercase letters');
        }
    }

    /**
     * A function which will return all of the relevant CommonClass information 
     * @returns Object containing all of the relevant class information
     */
    public commonClassInformation() {
        return {
            class_id: this.id,
            class_name: this.class_name,
            class_start_time: this.class_start_time,
            class_end_time: this.class_end_time,
            class_course_code: this.class_course_code,
            class_monday: this.class_runs_monday,
            class_tuesday: this.class_runs_tuesday,
            class_wednesday: this.class_runs_wednesday,
            class_thursday: this.class_runs_thursday,
            class_friday: this.class_runs_friday
        };
    }
}
