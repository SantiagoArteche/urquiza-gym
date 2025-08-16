export interface IRepository {
  getAll: (search?: string, limit?: number, offset?: number) => any;
  getById: (id: number) => any;
  deleteById: (id: number) => any;
  create: (data: any) => any;
}
