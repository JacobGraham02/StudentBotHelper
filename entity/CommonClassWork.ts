import { UUID } from "crypto";

export default class CommonClassWork {
    id: UUID;
    class_id: number;
    homework_name: string;
    homework_due_date: Date;
    homework_notes: string;

    private class_work_name_regex = /[a-zA-Z ]{1,100}/
    private class_work_notes_regex = /[a-zA-Z0-9 ]{1,10000}/

    constructor(id: UUID, class_id: number, homework_name: string, homework_due_date: Date, homework_notes: string) {
        this.validateHomeworkBetween1And10000Letters(homework_name);
        this.validateHomeworkNotesBetween1And10Letters(homework_notes);
        this.class_id = class_id;
        this.homework_name = homework_name;
        this.homework_due_date = homework_due_date;
        this.homework_notes = homework_notes;
        this.id = id;
    }

    /**
     * Validates that the homework name matches the following regex pattern: /[a-zA-Z ]{1,100}/
     * If the regex pattern does not match, an error is thrown indicating the user of this
     * @param homework_name a string containing the homework name
     */
    private validateHomeworkBetween1And10000Letters(homework_name: string): void {
        if (!homework_name.match(this.class_work_name_regex)) {
            throw new Error('The supplied homework notes is not between 1 and 10000 characters long, only lower and upper case characters');
        }
    }

    /**
     * Validates that the homework notes matches the following regex pattern: /[a-zA-Z0-9 ]{1,10000}/
     * If the regex pattern does not match, an error is thrown indicating the user of this
     * @param homework_notes a string containing the homework notes
     */
    private validateHomeworkNotesBetween1And10Letters(homework_notes: string): void {
        if (!homework_notes.match(this.class_work_notes_regex)) {
            throw new Error('The supplied homework notes is not between 1 and 100 characters long, only lower and upper case characters');
        }
    }

    /**
     * A function which will return all of the relevant CommonClassWork information 
     * @returns Object containing all of the relevant class work information
     */
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
