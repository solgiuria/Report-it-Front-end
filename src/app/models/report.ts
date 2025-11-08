import { SubtipoReporte } from "./categories";
import { User } from "./user";

export type ReportStatus = 'PENDIENTE' | 'EN_PROCESO' | 'CERRADO';

export interface ReportForm {
  idsubtipo_Reporte: number;
  descripcion: string;
  ubicacion: string;
  fechaHora: string;
}


export interface Report {
  id: number;
  descripcion: string;
  ubicacion: string;
  fecha_hora: string;
  estado: string;
  subtipo: SubtipoReporte;
  usuario: User;
}