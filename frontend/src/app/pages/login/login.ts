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

      if (res.user) {
        this.authService.saveUser(res.user);
      }

      // Redirect to HOME
      this.router.navigate(['/']); // or '/home'
    },

    error: () => {
      alert('Invalid email or password');
    }

  });
}

  
}
