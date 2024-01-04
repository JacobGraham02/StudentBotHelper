import { UUID } from 'crypto';
import CommonClassWork from '../entity/CommonClassWork';

export interface ICommonClassWorkRepository {
    findAll(): Promise<CommonClassWork[] | undefined>;
    findById(id: UUID): Promise<CommonClassWork | undefined>;
    findByClassId(class_id: UUID): Promise<CommonClassWork[] | undefined>;
    findByHomeworkName(homework_name: string): Promise<CommonClassWork[] | undefined>;
    create(common_class_work: CommonClassWork): Promise<any | undefined>;
    update(common_class_work: CommonClassWork): Promise<CommonClassWork | undefined>;
    delete(id: number): Promise<CommonClassWork | undefined>;
}
