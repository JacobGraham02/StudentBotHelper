import { UUID } from "crypto";


export default class StudentClass {
    
    private id: UUID;
    private student_id: UUID;
    private class_name: string;
    private class_time?: Date;
    private class_location?: string;
    private class_midterm_date?: Date;
    private class_exam_date?: Date

    constructor(id: UUID, student_id: UUID, class_name: string, class_time?: Date, class_location?: string, class_midterm_date?: Date, class_exam_date?: Date) {
        this.id = id;
        this.student_id = student_id;
        this.class_name = class_name;
        if (class_time) {
            this.class_time = class_time;
        }
        if (class_location) {
            this.class_location = class_location;
        }
        if (class_midterm_date) {
            this.class_midterm_date = class_midterm_date;
        }
        if (this.class_exam_date) {
            this.class_exam_date = class_exam_date;
        }
    }

    /**
     * A function which will return all of the relevant StudentClasss information 
     * @returns Object containing all of the relevant student class information
     */
    public classInformation() {
        return {
            id: this.id,
            student_id: this.student_id,
            class_name: this.class_name,
            class_time: this.class_time,
            class_location: this.class_location,
            class_midterm_date: this.class_midterm_date,
            class_exam_date: this.class_exam_date
        };
    }
}