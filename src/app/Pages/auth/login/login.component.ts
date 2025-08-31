import { LoginService } from './../../../Services/login.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ILogin } from '../../../Models/ILogin';

interface LoginResponse { token: string; }

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, FormsModule, HttpClientModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatPseudoCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private LoginService = inject(LoginService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  hide = true;
  loading = false;
  error: string | null = null;

  form!: FormGroup;

  constructor() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;

    this.error = null;
    this.loading = true;

    const { username, password } = this.form.value as ILogin;

    this.LoginService.login({ username, password })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: LoginResponse | null) => {
          if (res && res.token) {
            localStorage.setItem('token', res.token);
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/inicio';
            this.router.navigateByUrl(returnUrl);
          } else {
            this.error = 'Error al iniciar sesión';
          }
        },
        error: (err) => {
          this.error = err?.status === 401
            ? 'Error al intentar logearse'
            : 'No se pudo iniciar sesión. Intenta de nuevo.';
          console.log(err?.message ?? err);
        }
      });
  }
}
