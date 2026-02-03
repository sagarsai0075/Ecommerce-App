import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  searchText = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  search() {
    if (!this.searchText.trim()) return;

    this.router.navigate(['/products'], {
      queryParams: { search: this.searchText }
    });

    this.searchText = '';
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
