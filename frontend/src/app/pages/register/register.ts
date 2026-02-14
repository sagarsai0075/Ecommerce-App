import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { finalize, of, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  form: FormGroup;
  submitError = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      number: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ]

    });
  }

  register() {
    this.submitError = '';

    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = this.form.getRawValue();

    this.authService.register(payload).pipe(
      switchMap((registerRes: any) => {
        if (registerRes?.token) {
          return of(registerRes);
        }

        return this.authService.login({
          email: payload.email,
          password: payload.password
        });
      }),
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({

      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.router.navigateByUrl('/');
      },

      error: (err) => {
        const apiMessage = String(err?.error?.message || '').toLowerCase();
        this.submitError = apiMessage.includes('already')
          ? 'User already exists !!! Please Login'
          : 'Registration failed. Please try again.';
      }

    });

  }
}
