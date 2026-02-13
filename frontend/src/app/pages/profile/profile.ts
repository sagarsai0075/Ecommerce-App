import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface User {
  _id?: string;
  name: string;
  email: string;
  number: string;
  dateOfBirth?: string;
  houseNo?: string;
  address?: string;
  landmark?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  activeSection = 'personal-info';
  user: User | null = null;
  isLoading = true;
  loadError = '';
  
  // Edit mode
  editMode = false;
  editedUser: User = {
    name: '',
    email: '',
    number: '',
    dateOfBirth: '',
    houseNo: '',
    address: '',
    landmark: '',
    district: '',
    state: '',
    pincode: ''
  };

  // Change password
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordMessage = '';
  passwordMessageType: 'success' | 'error' | '' = '';
  showPasswordForm = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUser();
    
    // Get active section from URL fragment
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.activeSection = fragment;
      }
    });
  }

  loadUser() {
    this.loadError = '';
    const cached = this.authService.getUser();
    if (cached) {
      this.user = cached as User;
      this.editedUser = { ...cached };
    }

    this.isLoading = !cached;

    this.authService.ensureUserLoaded().subscribe({
      next: (userData: any) => {
        this.user = userData as User;
        this.editedUser = { ...userData };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.loadError = error?.error?.message || 'Unable to load profile.';

        if (error?.status === 401 || error?.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  retryLoadUser() {
    this.loadUser();
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  // Personal Info Methods
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode && this.user) {
      this.editedUser = { ...this.user };
    }
  }

  savePersonalInfo() {
    if (this.validatePersonalInfo()) {
      this.authService.updateProfile(this.editedUser).subscribe({
        next: (updated: any) => {
          this.user = updated as User;
          this.editedUser = { ...updated };
          this.editMode = false;
        }
      });
    }
  }

  validatePersonalInfo(): boolean {
    if (!this.editedUser.name || !this.editedUser.email || !this.editedUser.number) {
      return false;
    }
    return true;
  }

  // Change Password Methods
  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.resetPasswordForm();
  }

  changePassword() {
    this.passwordMessage = '';
    this.passwordMessageType = '';

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordMessage = 'Please fill all fields';
      this.passwordMessageType = 'error';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordMessage = 'New passwords do not match';
      this.passwordMessageType = 'error';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordMessage = 'Password must be at least 6 characters';
      this.passwordMessageType = 'error';
      return;
    }

    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordMessage = 'Password updated successfully';
        this.passwordMessageType = 'success';
        this.resetPasswordForm();
        this.showPasswordForm = false;
      },
      error: (error) => {
        this.passwordMessage = error?.error?.message || 'Password update failed';
        this.passwordMessageType = 'error';
      }
    });
  }

  resetPasswordForm() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  cancelEdit() {
    this.editMode = false;
    if (this.user) {
      this.editedUser = { ...this.user };
    }
  }
}







