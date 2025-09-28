type entity = "users" | "teachers";

export interface IRepository {
  getAll: (
    entityKey: entity,
    key: string,
    search?: string,
    limit?: number,
    offset?: number
  ) => any;
  getById: (id: number, entityKey?: entity) => any;
  getByCountryId: (countryId: string, entityKey?: entity) => any;
  deleteById: (id: number, entityKey?: entity) => any;
  create: (data: any, entityKey?: entity, uniqueKey?: string) => any;
  updateById: (
    id: number,
    data: object,
    entityKey?: "users" | "teachers"
  ) => any;
}
