import CommonClass from '../entity/CommonClass';

export interface ICommonClassRepository {
    findAll(): Promise<CommonClass[] | undefined>;
    findById(id: number): Promise<CommonClass | undefined>;
    findByClassName(class_name: string): Promise<CommonClass[] | undefined>;
    create(common_class: CommonClass): Promise<any | undefined>;
    update(common_class: CommonClass): Promise<CommonClass | undefined>;
    delete(id: number): Promise<CommonClass | undefined>;
}
