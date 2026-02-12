import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword implements OnInit {

  form: FormGroup;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    // Ensure form is properly initialized
    console.log('Form initialized:', this.form);
  }

  resetPassword() {
    if (this.form.invalid) {
      alert('Please enter a valid email address');
      return;
    }

    // TODO: Call your backend API to send reset email
    // this.authService.sendPasswordResetEmail(this.form.value.email).subscribe({
    //   next: () => {
    //     this.emailSent = true;
    //   },
    //   error: () => {
    //     alert('Error sending reset email');
    //   }
    // });

    // For now, show success message
    this.emailSent = true;
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}

