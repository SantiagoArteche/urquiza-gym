export interface IRepository {
  getAll: (search?: string, limit?: number, offset?: number) => any;
  getById: (id: number, entityKey?: string) => any;
  deleteById: (id: number, entityKey?: string) => any;
  create: (data: any, entityKey?: string) => any;
}
