import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeService } from '../../../core/services/type-service';
import { SubCategoryService} from '../../../core/services/sub-category-service';
import { ReportService } from '../../../core/services/report-service';

@Component({
  selector: 'app-report-form-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './report-form-page.html',
  styleUrl: './report-form-page.css',
})
export class ReportFormPage {
  private typeService = inject(TypeService);
  private subCategoryService = inject(SubCategoryService);
  private reportService = inject(ReportService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  readonly selectedImage = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly reportLectura = toSignal(this.reportService.getById(Number(this.id)));
  //readonly reportToEdit = signal(this.reportLectura());
  
  readonly categorias = toSignal(this.typeService.getAll(), { initialValue: [] });
  readonly todasLasSubcategorias = toSignal(this.subCategoryService.getAll(), { initialValue: [] });
  readonly selectedTipoId = signal<number | null>(null);


  tipoChange(value: string) {
    const tipoId = value === '' ? null : Number(value);
    this.selectedTipoId.set(tipoId);
  }

  protected readonly form = this.formBuilder.nonNullable.group({
    tipo_id: [null as number | null, Validators.required],
    subtipo_id: [null as number | null, Validators.required],
    ubicacion: ['', [Validators.required, Validators.minLength(5)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    fechaHora: ['', Validators.required],
  });

  get tipoId() { return this.form.controls.tipo_id; }
  get subtipoId() { return this.form.controls.subtipo_id; }
  get ubicacion() { return this.form.controls.ubicacion; }
  get descripcion() { return this.form.controls.descripcion; }
  get fechaHora() { return this.form.controls.fechaHora; }
 

  readonly subcategoriasDisponibles = computed(() => {
    const tipoId = this.selectedTipoId();
    if (!tipoId) return [];
    return this.todasLasSubcategorias().filter(sub => sub.tipo_reporte.id === tipoId);
  });

  constructor() {
    effect(() => {
      const tipoId = this.tipoId.value;
      if (tipoId) {
        this.subtipoId.setValue(null);
      }
    });

    effect(() => {
      const report = this.reportLectura();
      if (report) {
        this.form.patchValue({
          tipo_id: report.subtipo.tipo_reporte.id,
          subtipo_id: report.subtipo.id,
          ubicacion: report.ubicacion,
          descripcion: report.descripcion,
          fechaHora: report.fecha_hora.slice(0, 16)
        });

        this.selectedTipoId.set(report.subtipo.tipo_reporte.id);
      }
    });
  }

getTodayDateTime(): string {
  return new Date().toISOString().slice(0, 16);
}

handleSubmit() {
  if (this.form.invalid) {
    alert('Por favor completá todos los campos correctamente');
    return;
  }

  const mensaje = this.id 
    ? '¿Confirmas que querés actualizar este reporte?' 
    : '¿Confirmas que querés enviar este reporte?';

  if (confirm(mensaje)) {
    const formValue = this.form.getRawValue();

    if (this.id) {
      // EDITAR (sin imagen x ahora)
      const reportForm = {
        idsubtipo_Reporte: formValue.subtipo_id!,
        descripcion: formValue.descripcion,
        ubicacion: formValue.ubicacion,
        fechaHora: formValue.fechaHora + ':00',
      };

      this.reportService.update(Number(this.id), reportForm).subscribe({
        next: () => {
          alert('Reporte actualizado exitosamente');
          this.router.navigate(['/app/reports', this.id]);
        },
        error: (err) => {
          console.error('Error:', err);
          alert(err.error || 'Error al actualizar');
        }
      });
    } else {
      // CREAR (con imagen)
      const formData = new FormData();
      formData.append('idsubtipo_Reporte', formValue.subtipo_id!.toString());
      formData.append('descripcion', formValue.descripcion);
      formData.append('ubicacion', formValue.ubicacion);
      formData.append('fechaHora', formValue.fechaHora + ':00');

      // Agregar imagen si existe
      const imagen = this.selectedImage();
      if (imagen) {
        formData.append('imagen', imagen);
      }


      this.reportService.createWithImage(formData).subscribe({
        next: () => {
          alert('Reporte creado exitosamente');
          this.router.navigate(['/app/reports/my']);
        },
        error: (err) => {
          console.error('Error:', err);
          alert(err.error || 'Error al crear');
        }
      });
    }
  }
}

  formatCategoryName(name: string): string {
    return name.toLowerCase().split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  cancel() {
    if (confirm('¿Querés cancelar? Se perderán los cambios')) {
      if (this.id) {
        this.router.navigate(['/app/reports/my']);
      } else {
        this.router.navigate(['/app/reports']);
      }
    }
  }

  handleImageSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccioná un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
      }

      this.selectedImage.set(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.selectedImage.set(null);
    this.imagePreview.set(null);
  }

}