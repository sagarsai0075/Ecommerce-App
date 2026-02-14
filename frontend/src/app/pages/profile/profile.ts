import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface Address {
  addressType?: 'Home' | 'Work' | 'Others';
  customAddressType?: string;
  houseNo?: string;
  address?: string;
  landmark?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

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
  addresses?: Address[];
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
  isSavingAddress = false;

  addressEditMode = false;
  editingAddressIndex: number | null = null;
  editedAddress: Address = this.createEmptyAddress();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUser();

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
      this.syncAddressFromUser(cached as User);
    }

    this.isLoading = !cached;

    this.authService.ensureUserLoaded().subscribe({
      next: (userData: any) => {
        this.syncAddressFromUser(userData as User);
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

  toggleAddressEditMode() {
    if (this.addressEditMode) {
      this.cancelAddressEdit();
      return;
    }

    this.startAddAddress();
  }

  startAddAddress() {
    this.addressEditMode = true;
    this.editingAddressIndex = null;
    this.editedAddress = this.createEmptyAddress();
  }

  editAddress(index: number) {
    const addresses = this.getSavedAddresses();
    const selectedAddress = addresses[index];
    if (!selectedAddress) {
      return;
    }

    this.editedAddress = { ...selectedAddress };
    this.editingAddressIndex = index;
    this.addressEditMode = true;
  }

  saveAddress() {
    if (!this.user || this.isSavingAddress) {
      return;
    }

    const nextAddress = this.sanitizeAddress(this.editedAddress);
    if (!this.hasAnyAddressValue(nextAddress)) {
      this.cancelAddressEdit();
      return;
    }

    const addresses = [...this.getSavedAddresses()];
    if (this.editingAddressIndex !== null && addresses[this.editingAddressIndex]) {
      addresses[this.editingAddressIndex] = nextAddress;
    } else {
      addresses.push(nextAddress);
    }

    this.persistAddresses(addresses);
  }

  cancelAddressEdit() {
    this.addressEditMode = false;
    this.editingAddressIndex = null;
    this.editedAddress = this.createEmptyAddress();
  }

  deleteAddress(index: number) {
    if (!this.user) {
      return;
    }

    const addresses = this.getSavedAddresses().filter((_, currentIndex) => currentIndex !== index);
    this.persistAddresses(addresses);
  }

  getSavedAddresses(): Address[] {
    if (!this.user) {
      return [];
    }

    return this.extractAddresses(this.user);
  }

  hasSavedAddress(): boolean {
    return this.getSavedAddresses().length > 0;
  }

  getAddressTitle(address: Address): string {
    if (address.addressType === 'Others') {
      const customTitle = (address.customAddressType || '').trim();
      return customTitle || 'Others';
    }

    return address.addressType || 'Home';
  }

  private persistAddresses(addresses: Address[]) {
    if (!this.user) {
      return;
    }

    const normalizedAddresses = addresses
      .map((address) => this.sanitizeAddress(address))
      .filter((address) => this.hasAnyAddressValue(address));

    const primaryAddress = normalizedAddresses[0] || this.createEmptyAddress();

    const payload: User = {
      ...this.user,
      houseNo: primaryAddress.houseNo || '',
      address: primaryAddress.address || '',
      landmark: primaryAddress.landmark || '',
      district: primaryAddress.district || '',
      state: primaryAddress.state || '',
      pincode: primaryAddress.pincode || '',
      addresses: normalizedAddresses
    };

    const previousUser = this.user;
    this.isSavingAddress = true;
    this.user = payload;
    this.addressEditMode = false;
    this.editingAddressIndex = null;
    this.editedAddress = this.createEmptyAddress();

    this.authService.updateProfile(payload).subscribe({
      next: (updated: any) => {
        this.syncAddressFromUser(updated as User);
        this.isSavingAddress = false;
      },
      error: () => {
        this.user = previousUser;
        this.isSavingAddress = false;
      }
    });
  }

  private syncAddressFromUser(user: User) {
    const addresses = this.extractAddresses(user);
    this.user = {
      ...user,
      addresses
    };
    this.editedAddress = this.createEmptyAddress();
  }

  private extractAddresses(user: User): Address[] {
    if (Array.isArray(user.addresses) && user.addresses.length > 0) {
      return user.addresses
        .map((address) => this.sanitizeAddress(address))
        .filter((address) => this.hasAnyAddressValue(address));
    }

    const legacyAddress = this.sanitizeAddress(user);
    return this.hasAnyAddressValue(legacyAddress) ? [legacyAddress] : [];
  }

  private createEmptyAddress(): Address {
    return {
      addressType: 'Home',
      customAddressType: '',
      houseNo: '',
      address: '',
      landmark: '',
      district: '',
      state: '',
      pincode: ''
    };
  }

  private sanitizeAddress(address: Partial<Address>): Address {
    const addressType = address.addressType === 'Work' || address.addressType === 'Others' ? address.addressType : 'Home';
    const customAddressType = addressType === 'Others' ? (address.customAddressType || '').trim() : '';

    return {
      addressType,
      customAddressType,
      houseNo: (address.houseNo || '').trim(),
      address: (address.address || '').trim(),
      landmark: (address.landmark || '').trim(),
      district: (address.district || '').trim(),
      state: (address.state || '').trim(),
      pincode: (address.pincode || '').trim()
    };
  }

  private hasAnyAddressValue(address: Partial<Address>): boolean {
    return !!(
      address.houseNo ||
      address.address ||
      address.landmark ||
      address.district ||
      address.state ||
      address.pincode
    );
  }
}







