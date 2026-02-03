import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
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
    this.authService.login(this.form.value).subscribe({
      next: (res: { token: string }) => {
        this.authService.saveToken(res.token);
        this.router.navigateByUrl('/products');
      }
      
    });
  }
  
}
