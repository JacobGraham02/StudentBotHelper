import { UUID } from "crypto";

export default class CommonClassWork {
    id: UUID;
    class_id: number;
    homework_name: string;
    homework_due_date: Date;
    homework_notes: string;

    private class_name_regex = /[a-zA-Z ]{1,100}/
    private class_notes_regex = /[a-zA-Z0-9 ]{1,10000}/

    constructor(id: UUID, class_id: number, homework_name: string, homework_due_date: Date, homework_notes: string) {
        this.validateHomeworkName(homework_name);
        this.validateHomeworkNotes(homework_notes);
        this.class_id = class_id;
        this.homework_name = homework_name;
        this.homework_due_date = homework_due_date;
        this.homework_notes = homework_notes;
        this.id = id;
    }

    private validateHomeworkName(homework_name: string): void {
        if (!homework_name.match(this.class_name_regex)) {
            throw new Error('The supplied homework notes is not between 1 and 10000 characters long, only lower and upper case characters');
        }
    }

    private validateHomeworkNotes(homework_notes: string): void {
        if (!homework_notes.match(this.class_notes_regex)) {
            throw new Error('The supplied homework notes is not between 1 and 100 characters long, only lower and upper case characters');
        }
    }

    public commonClassWorkInformation() {
        return {
            id: this.id,
            class_id: this.class_id,
            homework_name: this.homework_name,
            homework_due_date: this.homework_due_date,
            homework_notes: this.homework_notes
        };
    }
}
