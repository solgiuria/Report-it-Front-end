export interface reportCategory {
  id: number;
  nombre: string;
}

export interface reportSubCategory {
  id: number;
  nombre: string;
  tipo_reporte: reportCategory;
}

