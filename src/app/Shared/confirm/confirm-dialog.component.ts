import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-wrapper">
      <div class="dialog-header">
        <mat-icon>help_outline</mat-icon>
        <div class="titles">
          <h3>{{ data.title || 'Confirmar acción' }}</h3>
          <p>Por favor confirma para continuar</p>
        </div>
      </div>

      <div class="dialog-content" [innerHTML]="data.message"></div>

      <div class="dialog-actions">
        <button mat-stroked-button (click)="close(false)">
          {{ data.cancelText || 'Cancelar' }}
        </button>
<button mat-raised-button
        style="background-color:#ef9a9a; color:#000"
        (click)="close(true)">
  {{ data.confirmText || 'Aceptar' }}
</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-wrapper { padding: 16px; background: #f7fbff; border-radius: 16px; }
    .dialog-header { display:flex; gap:12px; align-items:center; padding:8px 0 12px;
      background: linear-gradient(180deg,#eef6ff,#f7fbff); border-radius: 12px; }
    .dialog-header mat-icon { color:#2563eb; font-size:28px; width:28px; height:28px; }
    .titles h3 { margin:0; color:#0f3d6e; font-weight:700; }
    .titles p { margin:0; color:#3a6ea5; font-size:12px; }
    .dialog-content { margin:14px 0 6px; color:#0f172a; }
    .dialog-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:10px; }
    :host ::ng-deep .mat-mdc-raised-button.mat-primary {
      background:#3b82f6;
      box-shadow:0 2px 8px rgba(59,130,246,.25);
    }
    :host ::ng-deep .mat-mdc-stroked-button { border-color:#93c5fd; color:#2563eb; }
    :host ::ng-deep .mat-mdc-stroked-button:hover { background:#e8f0ff; }
  `]
})
export class ConfirmDialogComponent {
  private ref = inject(MatDialogRef<ConfirmDialogComponent>);
  data = inject<ConfirmData>(MAT_DIALOG_DATA);
  close(result: boolean) { this.ref.close(result); }
}
