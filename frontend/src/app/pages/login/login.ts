import { Component, OnInit } from '@angular/core';
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
export class Login implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [''],
      password: [''],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    const remembered = localStorage.getItem('rememberMe') === 'true';
    if (!remembered) return;

    const savedEmail = localStorage.getItem('rememberedEmail') || '';
    const savedPassword = localStorage.getItem('rememberedPassword') || '';

    this.form.patchValue({
      email: savedEmail,
      password: savedPassword,
      rememberMe: true
    });
  }

 login() {

  if (this.form.invalid) return;

  this.authService.login(this.form.value).subscribe({
    next: (res: any) => {
      const { email, password, rememberMe } = this.form.value;
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedEmail', email || '');
        localStorage.setItem('rememberedPassword', password || '');
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

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
