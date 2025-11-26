import { Component, computed, inject, signal } from '@angular/core';
import {statusFilter } from '../../../models/report';
import { ReportCard } from '../../../shared/components/report-card/report-card';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReportService } from '../../../core/services/report-service';
import { TypeService } from '../../../core/services/type-service';
import { SubCategoryService } from '../../../core/services/sub-category-service';


@Component({
  selector: 'app-reports-feed-page',
  standalone: true,
  imports: [ReportCard],
  templateUrl: './feed-page.html',
  styleUrl: './feed-page.css',
})


export class ReportsFeedPage {

  //SERVICIOS
  private readonly reportClient = inject(ReportService);
  private readonly categoryClient = inject(TypeService);
  private readonly subCategoryClient = inject(SubCategoryService);

// SIGNAL PARA FILTROS
  readonly selectedCategory = signal<'TODAS' | string>('TODAS');
  readonly selectedSubcategory = signal<'TODAS' | string>('TODAS');
  readonly selectedStatus = signal<statusFilter>('TODOS');

//DATOS DEL BACKEND
  readonly lectureReports = toSignal(this.reportClient.getAll(), { initialValue: [] });  
  readonly lectureCategories = toSignal(this.categoryClient.getAll(), { initialValue: [] });
  readonly lectureSubCategories = toSignal(this.subCategoryClient.getAll(), {initialValue: []});


  // SETTERS
  setCategory(category: 'TODAS' | string) { 
    this.selectedCategory.set(category);
    // Al cambiar categoría, reseteamos el signal subcategoría
    this.selectedSubcategory.set('TODAS');
  }

  setSubcategory(sub: 'TODAS' | string) {
    this.selectedSubcategory.set(sub);
  }

  setStatus(status: statusFilter) {
    this.selectedStatus.set(status);
  }


  //LIMPIAR FILTROS
  clearCategoryFilters() {
    this.selectedCategory.set('TODAS');
    this.selectedSubcategory.set('TODAS');
  }


  // COMPUTED: Lista de subcategorías según categoría seleccionada (cada vez que el usuario elige una CATEGORIA NUEVA necesitamos ACTUALIZAR el ARRAY de SUBCATEGORIAS que vamos a RENDERIZAR, porque deben ser ACORDE)
  readonly subcategories = computed(() => {
    const categoria = this.selectedCategory();
    if (categoria === 'TODAS') return [];
    
    const subcategories = this.lectureSubCategories();
    const filteredSubCategories = subcategories
      .filter(sub => sub.tipo_reporte.nombre === categoria); //devuelve arr de reportes q cumplen la condicion xq "no abre cajas". aca la => nos dice que condicion aplicar sobre cada elemento del array
                 //devuelve arr de strings, si le pido r.subtipo.nombre entonces me devuelve los strings! NO SE PONEN CONDICIONES EN MAP XQ NO SIRVE P FILTRAR, sino para TRASNFORMAR todos los elmentos y extraer la misma info de cada uno de los elementos (como el nombre en este caso)
    
    return filteredSubCategories;
  });


  // COMPUTED: Reportes filtrados (ahora en el orden correcto)
  readonly filteredReports = computed(() => {
    const categoria = this.selectedCategory();
    const subcategoria = this.selectedSubcategory();
    const estado = this.selectedStatus();
    const base = this.lectureReports();

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


   formatCategoryName(name: string | undefined): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

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