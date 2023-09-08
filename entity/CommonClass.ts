export default class CommonClass {
    private id?: number;
    private class_name: string;
    private class_time: Date; 
    private class_notes: string;

    private class_name_regex = /[a-zA-Z ]{1,100}/
    private class_notes_regex = /[a-zA-Z0-9 ]{1,10000}/

    constructor(class_name: string, class_time: Date, class_notes: string, id?: number) {
        this.validateClassName(class_name);
        this.validateClassTime(class_time);
        this.validateClassNotes(class_notes);
        if (id !== undefined) {
            this.id = id;
        }
        this.class_name = class_name;
        this.class_time = class_time;
        this.class_notes = class_notes;
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

    private validateClassNotes(class_notes: string): void {
        if (!class_notes.match(this.class_notes_regex)) {
            throw new Error('The supplied class notes are invalid: Must be between 1 and 10000 characters of only upper and lower case characters, with numbers 0 through 9');
        }
    }

    public commonClassInformation() {
        return {
            class_id: this.id,
            class_name: this.class_name,
            class_time: this.class_time,
            class_notes: this.class_notes
        };
    }
}
