import { SubtipoReporte } from "./categories";
import { User } from "./user";

export type ReportStatus = 'PENDIENTE' | 'EN_PROCESO' | 'FINALIZADO';
export type statusFilter = 'TODOS' | ReportStatus;
export interface ReportForm {
  idsubtipo_Reporte: number;
  descripcion: string;
  ubicacion: string;
  fechaHora: string;
}

//no lo puedo llamar Report porq ya existe un tipo propio de typescript q se llama asi y hacia q se rompa todo ya q lo interpretaba como eso
export interface Reporte {
  id: number;
  descripcion: string;
  ubicacion: string;
  fecha_hora: string;
  estado: string;
  subtipo: SubtipoReporte;
  usuario: User;
}

