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
    const userData = this.authService.getUser();
    if (userData) {
      this.user = userData;
      this.editedUser = { ...userData };
    }
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
      // Update localStorage
      this.user = { ...this.editedUser };
      this.authService.saveUser(this.user);
      this.editMode = false;
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

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordMessage = 'Please fill all fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordMessage = 'New passwords do not match';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordMessage = 'Password must be at least 6 characters';
      return;
    }

    // You can add backend API call here to change password
    this.resetPasswordForm();
    this.showPasswordForm = false;
  }

  resetPasswordForm() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordMessage = '';
  }

  cancelEdit() {
    this.editMode = false;
    if (this.user) {
      this.editedUser = { ...this.user };
    }
  }
}

