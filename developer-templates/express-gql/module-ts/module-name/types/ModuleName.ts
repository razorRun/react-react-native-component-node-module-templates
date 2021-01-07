export interface IModuleName {
  id?: number;
  created_by: number;

  created_at: number | string;
  updated_at: number | string;
}
export enum ModuleNameStatus {
  active = 1,
  disabled = 2,
  deleted = 3,
}

export enum ModuleNameTypes {
  type1 = 1,
  type2 = 2,
}
