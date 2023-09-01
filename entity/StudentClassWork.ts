import { UUID } from "crypto";


export default class StudentClassWork {
    private id: UUID;
    private student_class_id: UUID;
    private class_work_name: string;
    private class_work_start_date?: Date;
    private class_work_end_date?: Date;
    private class_work_notes?: string;

    constructor(id: UUID, student_class_id: UUID, class_work_name: string, class_work_start_date?: Date, class_work_end_date?: Date, class_work_notes?: string) {
        this.id = id;
        this.student_class_id = student_class_id;
        this.class_work_name = class_work_name;
        
        if (class_work_start_date) {
            this.class_work_start_date = class_work_start_date;
        }
        if (class_work_end_date) {
            this.class_work_end_date = class_work_end_date;
        }
        if (class_work_notes) {
            this.class_work_notes = class_work_notes;
        }
    }

    public studentWorkInformation() {
        return {
            id: this.id,
            student_class_id: this.student_class_id,
            class_work_name: this.class_work_name,
            class_work_start_date: this.class_work_start_date,
            class_work_end_date: this.class_work_end_date,
            class_work_notes: this.class_work_notes
        }
    }
}