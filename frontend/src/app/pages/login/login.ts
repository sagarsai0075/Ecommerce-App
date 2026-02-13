import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

 login() {

  if (this.form.invalid) return;

  this.authService.login(this.form.value).subscribe({
    next: (res: any) => {
      this.authService.saveToken(res.token);
      this.router.navigate(['/']);
    },
    error: (error) => {
      console.error('Invalid email or password:', error);
      // You can also display an error message to the user here
      // e.g., using a toast service or snackbar
    }
  });
}

  
}
