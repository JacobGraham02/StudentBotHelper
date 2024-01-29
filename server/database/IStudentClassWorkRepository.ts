import { UUID } from "crypto";
import StudentClassWork from "../entity/StudentClassWork";


export default interface IStudentClassWorkRepository {
    findAll(): Promise<StudentClassWork[] | undefined>
    findById(id: UUID): Promise<StudentClassWork | undefined>
    findByWorkName(work_name: string): Promise<StudentClassWork | undefined>
    create(work_document: StudentClassWork): Promise<any | undefined>
    update(work_document: StudentClassWork): Promise<any | undefined>
    delete(work_document_id: UUID): Promise<StudentClassWork | undefined>
}