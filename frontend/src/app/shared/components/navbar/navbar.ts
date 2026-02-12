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
  // Dummy items organized per starting alphabet (4-5 items per letter)
  dummyMap: { [letter: string]: string[] } = {
    a: ['Apple AirPods', 'Almond Milk', 'Acrylic Paint Set', 'Athletic Shorts', 'Alarm Clock'],
    b: ['Bluetooth Speaker', 'Backpack', 'Button-Up Shirt', 'BBQ Grill Brush', 'Beanie Hat'],
    c: ['Coffee Mug', 'Camping Tent', 'Canvas Tote', 'Cotton T-Shirt', 'Computer Mouse'],
    d: ['Desk Lamp', 'Denim Jacket', 'Dumbbell Set', 'Dish Rack'],
    e: ['Earbuds', 'Electric Kettle', 'E-reader Cover', 'Exercise Mat'],
    f: ['Fitness Tracker', 'Food Container', 'Fountain Pen', 'Flip Flops'],
    g: ['Gaming Mouse', 'Grocery Tote', 'Graphic Tee', 'Garden Gloves'],
    h: ['Hoodie', 'Hair Dryer', 'Hiking Boots', 'Handbag'],
    i: ['iPhone Case', 'Instant Camera', 'Ice Roller', 'Ironing Board'],
    j: ['Jeans', 'Juicer', 'Journal', 'Jacket'],
    k: ['Kitchen Knife Set', 'Keychain', 'Knee Pads', 'Kettle'],
    l: ['Leather Wallet', 'Laptop Sleeve', 'LED Strip', 'Lunch Box'],
    m: ['Mouse Pad', 'Microphone', 'Moisturizer', 'Memory Foam Pillow'],
    n: ['Notebook', 'Neck Pillow', 'Noise Cancelling Headphones', 'Nail Kit'],
    o: ['Office Chair', 'Oil Diffuser', 'Organizer Tray', 'Outdoor Lantern'],
    p: ['Portable Charger', 'Power Bank', 'Pajama Set', 'Portable Fan'],
    q: ['Quilt', 'QR Code Scanner', 'Quick-dry Towels', 'Quartz Watch'],
    r: ['Running Shoes', 'Rain Jacket', 'Reusable Bottle', 'Robot Vacuum'],
    s: ['Smart Watch', 'Sunglasses', 'Standing Desk', 'Socks'],
    t: ['Travel Adapter', 'Table Lamp', 'Tote Bag', 'Tennis Racket'],
    u: ['USB Hub', 'Umbrella', 'Universal Remote', 'Upholstery Brush'],
    v: ['Vacuum Cleaner', 'Vase', 'Video Game', 'Velvet Pillow'],
    w: ['Water Bottle', 'Wireless Headphones', 'Wrist Watch', 'Wireless Charger'],
    x: ['Xbox Controller', 'Xylophone Toy', 'Xtreme Sports Bag'],
    y: ['Yoga Mat', 'Yogurt Maker', 'Yarn Kit'],
    z: ['Zipper Hoodie', 'Zinc Sunscreen', 'Zigzag Notebook']
  };

  suggestions: string[] = [];

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

  closeDropdown() {
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.user-dropdown')) {
      this.showDropdown = false;
    }

    // close suggestions when clicking outside the search box
    if (!target.closest('.search')) {
      this.suggestions = [];
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

  // Update suggestions as user types
  updateSuggestions() {
    const q = this.searchText.trim().toLowerCase();
    if (!q) {
      this.suggestions = [];
      return;
    }

    // If user typed a single alphabet letter, return that letter's preset (4-5 items)
    if (q.length === 1 && this.dummyMap[q]) {
      this.suggestions = this.dummyMap[q].slice(0, 5);
      return;
    }

    // Otherwise, search across all dummy items and return up to 5 matches
    const allItems = Object.values(this.dummyMap).flat();
    this.suggestions = allItems
      .filter(item => item.toLowerCase().includes(q))
      .slice(0, 5);
  }

  // Select a suggestion and navigate
  selectSuggestion(item: string) {
    this.router.navigate(['/products'], {
      queryParams: { search: item }
    });

    this.searchText = '';
    this.suggestions = [];
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
