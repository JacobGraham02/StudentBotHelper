import { UUID } from "crypto";
import StudentClass from "../entity/StudentClass";

export default interface IStudentClassRepository {
    findAll(): Promise<StudentClass[] | undefined>
    findById(id: UUID): Promise<StudentClass | undefined>
    findByClassName(class_name: string): Promise<StudentClass | undefined>
    create(student_class: StudentClass): Promise<any | undefined>
    update(student_class: StudentClass): Promise<any | undefined>
    delete(student_class_id: UUID): Promise<StudentClass | undefined>
}