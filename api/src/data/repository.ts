export interface IRepository {
  getAll: (search?: string, limit?: number, offset?: number) => any;
  getById: (id: number, key?: string) => any;
  getByCountryId: (countryId: string, key?: string) => any;
  deleteById: (id: number, key?: string) => any;
  create: (data: any, key?: string) => any;
}
