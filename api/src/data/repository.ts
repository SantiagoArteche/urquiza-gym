export interface IRepository {
  getAll: (
    entityKey: string,
    key: string,
    search?: string,
    limit?: number,
    offset?: number
  ) => any;
  getById: (id: number, key?: string) => any;
  getByCountryId: (countryId: string, key?: string) => any;
  deleteById: (id: number, key?: string) => any;
  create: (data: any, key?: string, uniqueKey?: string) => any;
}
