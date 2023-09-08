import CommonClassWork from '../entity/CommonClassWork';

export interface ICommonClassWorkRepository {
    findAll(): Promise<CommonClassWork[] | undefined>;
    findById(id: number): Promise<CommonClassWork | undefined>;
    findByClassId(class_id: number): Promise<CommonClassWork[] | undefined>;
    findByHomeworkName(homework_name: string): Promise<CommonClassWork[] | undefined>;
    create(common_class_work: CommonClassWork): Promise<any | undefined>;
    update(common_class_work: CommonClassWork): Promise<CommonClassWork | undefined>;
    delete(id: number): Promise<CommonClassWork | undefined>;
}
