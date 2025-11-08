export interface TipoReporte {
  id: number;
  nombre: string;
}

export interface SubtipoReporte {
  id: number;
  nombre: string;
  tipo_reporte: TipoReporte;
}

