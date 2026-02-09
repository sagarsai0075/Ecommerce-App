import { Component, HostListener } from '@angular/core';
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

  userName = '';
  showDropdown = false;

  searchText = '';
  email = '';
  password = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.loadUser();
  }

  /* ==========================
     DROPDOWN
  ========================== */

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.user-dropdown')) {
      this.showDropdown = false;
    }
  }

  /* ==========================
     LOGIN
  ========================== */

  login() {
    if (!this.email || !this.password) return;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.loadUser();
        this.router.navigateByUrl('/home');
      },
      error: () => alert('Invalid credentials')
    });
  }

  /* ==========================
     SEARCH
  ========================== */

  search() {
    if (!this.searchText.trim()) return;

    this.router.navigate(['/products'], {
      queryParams: { search: this.searchText }
    });

    this.searchText = '';
  }

  /* ==========================
     LOGOUT
  ========================== */

  logout() {
    localStorage.removeItem('user');
    this.authService.logout();
    this.showDropdown = false;
    this.router.navigateByUrl('/login');
  }

  /* ==========================
     LOAD USER
  ========================== */

  loadUser() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      this.userName = parsed.name || parsed.email;
    }
  }
}
