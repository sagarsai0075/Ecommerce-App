import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  // Search
  searchText = '';

  // Login form
  email = '';
  password = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  // LOGIN FROM NAVBAR
  login() {
    if (!this.email || !this.password) return;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);

        this.email = '';
        this.password = '';

        this.router.navigateByUrl('/products');
      },
      error: () => {
        alert('Invalid credentials');
      }
    });
  }

  // SEARCH
  search() {
    if (!this.searchText.trim()) return;

    this.router.navigate(['/products'], {
      queryParams: { search: this.searchText }
    });

    this.searchText = '';
  }

  // LOGOUT
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
