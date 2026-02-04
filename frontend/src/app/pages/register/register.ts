import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

this.form = this.fb.group({
  name: [''],
  email: [''],
  password: [''],
  number: ['']
});


  }

  register() {

  console.log(this.form.value);

  this.authService.register(this.form.value).subscribe({
    next: () => {
      
      this.router.navigateByUrl('/products');
    },
    error: (err) => {
      console.log(err);
      
    }
  });

}

}
