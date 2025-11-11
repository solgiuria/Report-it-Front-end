import { Component, computed, signal } from '@angular/core';
import { ReportCard } from '../../components/report-card/report-card';
import { Reporte, statusFilter } from '../../../../../models/report'; 

@Component({
  selector: 'app-reports-feed-page',
  standalone: true,
  imports: [ReportCard],
  templateUrl: './reports-feed-page.html',
  styleUrl: './reports-feed-page.css',
})


export class ReportsFeedPage {

// SIGNAL PARA FILTRO DE CATEGORÍA PRINCIPAL
  readonly selectedCategory = signal<'TODAS' | string>('TODAS');
  
  // SIGNAL PARA FILTRO DE SUBCATEGORÍA
  readonly selectedSubcategory = signal<'TODAS' | string>('TODAS');
  
  // SIGNAL PARA FILTRO DE ESTADO
  readonly selectedStatus = signal<statusFilter>('TODOS');

  // SETTERS
  setCategory(cat: 'TODAS' | string) { 
    this.selectedCategory.set(cat);
    // Al cambiar categoría, reseteamos el signal subcategoría
    this.selectedSubcategory.set('TODAS');
  }

  setSubcategory(sub: 'TODAS' | string) {
    this.selectedSubcategory.set(sub);
  }

  setStatus(status: statusFilter) {
    this.selectedStatus.set(status);
  }

  // Método para volver a "TODAS" (limpiar filtros de categoría)
  clearCategoryFilters() {
    this.selectedCategory.set('TODAS');
    this.selectedSubcategory.set('TODAS');
  }

  // COMPUTED: Lista de categorías principales únicas. Lee (dependencia) el array de reportes que viene de la base, por ende solo cambia si se agrega o borra una categoria (el array se tiene q actualizar para, en la parte de filtros por categoria, mostrar una categoria nueva o quitar una q ya no existe)
  readonly categories = computed(() => {
    const nombres = this.reportesPrueba().map(r => r.subtipo?.tipo_reporte?.nombre ?? '(Sin categoría)'); //ARRAY DE STRINGS NOMBRES. ACA la arrow function => nos dice "que hacer con cada elemento del array"
    const unicas = Array.from(new Set(nombres)).sort();
    return unicas; // Ya NO incluimos 'TODAS' acá, lo ponemos manual en el HTML
  });


  // COMPUTED: Lista de subcategorías según categoría seleccionada (cada vez que el usuario elige una CATEGORIA NUEVA necesitamos ACTUALIZAR el ARRAY de SUBCATEGORIAS que vamos a RENDERIZAR, porque deben ser ACORDE)
  readonly subcategories = computed(() => {
    const categoria = this.selectedCategory();
    if (categoria === 'TODAS') return [];
    
    const reportes = this.reportesPrueba();
    const nombres = reportes
      .filter(r => r.subtipo?.tipo_reporte?.nombre === categoria) //devuelve arr de reportes q cumplen la condicion xq "no abre cajas". aca la => nos dice que condicion aplicar sobre cada elemento del array
      .map(r => r.subtipo?.nombre ?? '(Sin subtipo)');            //devuelve arr de strings, si le pido r.subtipo.nombre entonces me devuelve los strings! NO SE PONEN CONDICIONES EN MAP XQ NO SIRVE P FILTRAR, sino para TRASNFORMAR todos los elmentos y extraer la misma info de cada uno de los elementos (como el nombre en este caso)
    
    return Array.from(new Set(nombres)).sort();
  });


  // COMPUTED: Reportes filtrados (ahora en el orden correcto)
  readonly filteredReports = computed(() => {
    const categoria = this.selectedCategory();
    const subcategoria = this.selectedSubcategory();
    const estado = this.selectedStatus();
    const base = this.reportesPrueba();

    // 1️⃣ Filtrar por CATEGORÍA primero
    let result = (categoria === 'TODAS')
      ? base
      : base.filter(r => r.subtipo?.tipo_reporte?.nombre === categoria);

    // 2️⃣ Filtrar por SUBCATEGORÍA
    result = (subcategoria === 'TODAS')
      ? result
      : result.filter(r => r.subtipo?.nombre === subcategoria);

    // 3️⃣ Filtrar por ESTADO al final
    result = (estado === 'TODOS')
      ? result
      : result.filter(r => r.estado === estado);

    return result;
  });


  
//simulamos base de datos/back y es un signal porq @for en el html reacciona solo cuando cambia
readonly reportesPrueba = signal<Reporte[]>([
  {
    id: 1,
    descripcion: 'Pozo grande en la esquina, peligroso al pasar.',
    ubicacion: 'Av. Independencia 123',
    fecha_hora: '2025-11-10',
    estado: 'PENDIENTE',
    subtipo: {
      id: 7,
      nombre: 'Pozos',
      tipo_reporte: { id: 2, nombre: 'Baches' },
    },
    usuario: {
      id: 3,
      nombre: 'Sol',
      apellido: 'Giuria',
      edad: 20,
      email: 'sol@gmail.com',
      dni: 12345678,
      username: 'solgiuria',
      password: '',
    },
  },
  {
    id: 2,
    descripcion: 'Luz rota frente a la escuela primaria.',
    ubicacion: 'Calle Rawson 900',
    fecha_hora: '2025-11-05',
    estado: 'EN_PROCESO',
    subtipo: {
      id: 5,
      nombre: 'Lámpara apagada',
      tipo_reporte: { id: 3, nombre: 'Alumbrado público' },
    },
    usuario: {
      id: 6,
      nombre: 'María',
      apellido: 'Fernández',
      edad: 32,
      email: 'maria@gmail.com',
      dni: 33456789,
      username: 'mariaf',
      password: '',
    },
  },
  {
    id: 3,
    descripcion: 'Contenedor desbordado con basura acumulada.',
    ubicacion: 'Av. Colón 3400',
    fecha_hora: '2025-10-30',
    estado: 'FINALIZADO',
    subtipo: {
      id: 2,
      nombre: 'Contenedor roto',
      tipo_reporte: { id: 4, nombre: 'Residuos urbanos' },
    },
    usuario: {
      id: 7,
      nombre: 'Juan',
      apellido: 'Pérez',
      edad: 40,
      email: 'juanp@gmail.com',
      dni: 29566789,
      username: 'juanp',
      password: '',
    },
  },
  {
    id: 4,
    descripcion: 'Bache profundo en el medio de la calle.',
    ubicacion: 'Calle Mitre 456',
    fecha_hora: '2025-11-08',
    estado: 'PENDIENTE',
    subtipo: {
      id: 8,
      nombre: 'Calzada deteriorada',
      tipo_reporte: { id: 2, nombre: 'Baches' },
    },
    usuario: {
      id: 8,
      nombre: 'Carlos',
      apellido: 'López',
      edad: 35,
      email: 'carlos@gmail.com',
      dni: 30123456,
      username: 'carlosl',
      password: '',
    },
  },
  {
    id: 5,
    descripcion: 'Vereda hundida, riesgo de tropiezos.',
    ubicacion: 'Av. Libertador 789',
    fecha_hora: '2025-11-09',
    estado: 'EN_PROCESO',
    subtipo: {
      id: 9,
      nombre: 'Vereda rota',
      tipo_reporte: { id: 5, nombre: 'Infraestructura' },
    },
    usuario: {
      id: 9,
      nombre: 'Ana',
      apellido: 'García',
      edad: 28,
      email: 'ana@gmail.com',
      dni: 31456789,
      username: 'anag',
      password: '',
    },
  },
  {
    id: 6,
    descripcion: 'Semáforo en rojo permanente, genera congestionamiento.',
    ubicacion: 'Av. San Martín 1500',
    fecha_hora: '2025-11-07',
    estado: 'PENDIENTE',
    subtipo: {
      id: 10,
      nombre: 'Semáforo defectuoso',
      tipo_reporte: { id: 5, nombre: 'Infraestructura' },
    },
    usuario: {
      id: 10,
      nombre: 'Roberto',
      apellido: 'Martínez',
      edad: 45,
      email: 'roberto@gmail.com',
      dni: 28345678,
      username: 'robertom',
      password: '',
    },
  },
  {
    id: 7,
    descripcion: 'Basura acumulada en la esquina hace una semana.',
    ubicacion: 'Calle Belgrano 234',
    fecha_hora: '2025-10-28',
    estado: 'FINALIZADO',
    subtipo: {
      id: 3,
      nombre: 'Basura en vía pública',
      tipo_reporte: { id: 4, nombre: 'Residuos urbanos' },
    },
    usuario: {
      id: 11,
      nombre: 'Laura',
      apellido: 'Sánchez',
      edad: 38,
      email: 'laura@gmail.com',
      dni: 32567890,
      username: 'lauras',
      password: '',
    },
  },
  {
    id: 8,
    descripcion: 'Poste de luz sin funcionar desde hace 3 días.',
    ubicacion: 'Calle Sarmiento 678',
    fecha_hora: '2025-11-06',
    estado: 'EN_PROCESO',
    subtipo: {
      id: 6,
      nombre: 'Poste dañado',
      tipo_reporte: { id: 3, nombre: 'Alumbrado público' },
    },
    usuario: {
      id: 12,
      nombre: 'Diego',
      apellido: 'Ramírez',
      edad: 29,
      email: 'diego@gmail.com',
      dni: 33678901,
      username: 'diegor',
      password: '',
    },
  },
  {
    id: 9,
    descripcion: 'Calle con varios baches que dañan vehículos.',
    ubicacion: 'Calle Rivadavia 890',
    fecha_hora: '2025-11-11',
    estado: 'PENDIENTE',
    subtipo: {
      id: 7,
      nombre: 'Pozos',
      tipo_reporte: { id: 2, nombre: 'Baches' },
    },
    usuario: {
      id: 3,
      nombre: 'Sol',
      apellido: 'Giuria',
      edad: 20,
      email: 'sol@gmail.com',
      dni: 12345678,
      username: 'solgiuria',
      password: '',
    },
  },
  {
    id: 10,
    descripcion: 'Contenedor de basura roto, derrama residuos.',
    ubicacion: 'Av. Constitución 1200',
    fecha_hora: '2025-11-04',
    estado: 'FINALIZADO',
    subtipo: {
      id: 2,
      nombre: 'Contenedor roto',
      tipo_reporte: { id: 4, nombre: 'Residuos urbanos' },
    },
    usuario: {
      id: 7,
      nombre: 'Juan',
      apellido: 'Pérez',
      edad: 40,
      email: 'juanp@gmail.com',
      dni: 29566789,
      username: 'juanp',
      password: '',
    },
  },
  {
    id: 11,
    descripcion: 'Alumbrado deficiente en toda la cuadra.',
    ubicacion: 'Calle Alem 345',
    fecha_hora: '2025-11-03',
    estado: 'EN_PROCESO',
    subtipo: {
      id: 5,
      nombre: 'Lámpara apagada',
      tipo_reporte: { id: 3, nombre: 'Alumbrado público' },
    },
    usuario: {
      id: 6,
      nombre: 'María',
      apellido: 'Fernández',
      edad: 32,
      email: 'maria@gmail.com',
      dni: 33456789,
      username: 'mariaf',
      password: '',
    },
  },
  {
    id: 12,
    descripcion: 'Vereda con baldosas sueltas y peligrosas.',
    ubicacion: 'Calle Moreno 567',
    fecha_hora: '2025-11-02',
    estado: 'PENDIENTE',
    subtipo: {
      id: 9,
      nombre: 'Vereda rota',
      tipo_reporte: { id: 5, nombre: 'Infraestructura' },
    },
    usuario: {
      id: 9,
      nombre: 'Ana',
      apellido: 'García',
      edad: 28,
      email: 'ana@gmail.com',
      dni: 31456789,
      username: 'anag',
      password: '',
    },
  },
]);





}

/* computed = “calculadora”
Cuando la vista necesita la lista filtrada, le pide a la calculadora y recibe el array. Por eso podés usarlo en el HTML (ej: el @for) como si fuera un valor.

effect = “alarma”
Es una campanita que ejecuta acciones cuando algo cambia (log, guardar en storage, pedir datos, etc.). No entrega un valor para la vista. Lo que pongas como return no se usa como resultado (se usa para limpieza interna).

¿Qué pasa si cambiás tu computed por un effect?

Tu filteredReports deja de ser un valor (no “contiene” el array filtrado).

En el HTML, cuando intentes usarlo para listar (el @for), no va a tener qué mostrar (porque un effect no devuelve el array).

En otras palabras: no sirve para alimentar la vista.

Si quisieras usar effect sí o sí…

Tendrías que tener otra cajita (por ejemplo, un signal separado) y dentro del effect ir cargando ahí la lista filtrada. Es más vuelta. El computed te da eso automático y más limpio.

Regla cortita para recordar

¿Necesito un valor derivado para mostrar? → computed.

¿Necesito hacer “algo” cuando cambia un valor (llamar API, log, guardar)? → effect. */