// category-management-page.ts - AGREGAR estos imports y código

import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TypeService } from '../../../core/services/type-service';

import { FormsModule } from '@angular/forms';
import { SubCategoryService } from '../../../core/services/sub-category-service';

@Component({
  selector: 'app-category-management-page',
  standalone: true,
  imports: [FormsModule], // 👈 AGREGAR ESTO
  templateUrl: './category-management-page.html',
  styleUrl: './category-management-page.css',
})
export class CategoryManagementPage {
  
  // SERVICIOS
  private readonly categoryService = inject(TypeService);
  private readonly subCategoryService = inject(SubCategoryService);

  // DATOS DEL BACKEND
  readonly categories = toSignal(this.categoryService.getAll(), { initialValue: [] });
  readonly subCategories = toSignal(this.subCategoryService.getAll(), { initialValue: [] });

  // SIGNALS PARA FORMULARIOS DE CATEGORIAS
  readonly newCategoryName = signal<string>('');
  readonly showCategoryForm = signal<boolean>(false);

  // SIGNALS PARA FORMULARIOS DE SUBCATEGORÍAS
  readonly newSubCategoryName = signal<string>('');
  readonly selectedCategoryId = signal<number>(0);;
  readonly showSubCategoryForm = signal<boolean>(false);



  // Formatear nombres
  formatCategoryName(name: string | undefined): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Mostrar/ocultar formulario de categoría
  toggleCategoryForm() {
    this.showCategoryForm.update(v => !v);
    if (!this.showCategoryForm()) {
      this.newCategoryName.set('');
    }
  }

  // Crear categoría
  handleCreateCategory() {
    const nombre = this.newCategoryName().trim();
    
    if (!nombre) {
      alert('El nombre de la categoría no puede estar vacío');
      return;
    }

    // Convertir a formato con guiones bajos y mayúsculas (ej: "Medio Ambiente" -> "MEDIO_AMBIENTE")
    const nombreFormateado = nombre.toUpperCase().replace(/\s+/g, '_');

    this.categoryService.create(nombreFormateado).subscribe({
      next: () => {
        alert('Categoría creada exitosamente');
        this.newCategoryName.set('');
        this.showCategoryForm.set(false);
        // Recargar categorías
        window.location.reload();
      },
      error: (err) => {
        console.error('Error al crear categoría:', err);
        alert(err.error || 'Error al crear la categoría');
      }
    });
  }

  // Eliminar categoría
  handleDeleteCategory(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de eliminar la categoría "${this.formatCategoryName(nombre)}"?\n\nEsto también eliminará todas sus subcategorías asociadas.`)) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          alert('Categoría eliminada exitosamente');
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          alert(err.error || 'Error al eliminar la categoría');
        }
      });
    }
  }

  // Mostrar/ocultar formulario de subcategoría
  toggleSubCategoryForm() {
    this.showSubCategoryForm.update(v => !v);
    if (!this.showSubCategoryForm()) {
      this.newSubCategoryName.set('');
      this.selectedCategoryId.set(0);
    }
  }

  // Crear subcategoría
  handleCreateSubCategory() {
    const nombre = this.newSubCategoryName().trim();
    const tipoId = Number(this.selectedCategoryId()); 
    
    if (!nombre) {
      alert('El nombre de la subcategoría no puede estar vacío');
      return;
    }

    if (!tipoId || tipoId === 0) {
      alert('Debes seleccionar una categoría');
      return;
    }

    // Convertir a formato con guiones bajos y mayúsculas
    const nombreFormateado = nombre.toUpperCase().replace(/\s+/g, '_');

    this.subCategoryService.create(nombreFormateado, tipoId).subscribe({
      next: () => {
        alert('Subcategoría creada exitosamente');
        this.newSubCategoryName.set('');
        this.selectedCategoryId.set(0);
        this.showSubCategoryForm.set(false);
        window.location.reload();
      },
      error: (err) => {
        console.error('Error al crear subcategoría:', err);
        alert(err.error || 'Error al crear la subcategoría');
      }
    });
  }

  // Eliminar subcategoría
  handleDeleteSubCategory(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de eliminar la subcategoría "${this.formatCategoryName(nombre)}"?`)) {
      this.subCategoryService.delete(id).subscribe({
        next: () => {
          alert('Subcategoría eliminada exitosamente');
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al eliminar subcategoría:', err);
          alert(err.error || 'Error al eliminar la subcategoría');
        }
      });
    }
  }


}

