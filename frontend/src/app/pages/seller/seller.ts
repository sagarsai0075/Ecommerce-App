import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../core/services/seller';

interface SellerProfile {
  businessName: string;
  category: string;
  description: string;
  gstNumber: string;
  bankAccount: string;
  ifscCode: string;
  phone: string;
  email: string;
  address: string;
}

interface SellerStats {
  totalProducts: number;
  totalSales: number;
  revenue: number;
  orders: number;
  rating: number;
}

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller.html',
  styleUrl: './seller.css',
})
export class Seller implements OnInit {
  activeTab = 'dashboard';
  isSellerRegistered = false;
  editMode = false;

  sellerProfile: SellerProfile = {
    businessName: '',
    category: '',
    description: '',
    gstNumber: '',
    bankAccount: '',
    ifscCode: '',
    phone: '',
    email: '',
    address: ''
  };

  editedProfile: SellerProfile = { ...this.sellerProfile };

  stats: SellerStats = {
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
    orders: 0,
    rating: 0
  };

  categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Fashion',
    'Health & Wellness',
    'Other'
  ];

  constructor(private sellerService: SellerService) {}

  ngOnInit() {
    this.loadSellerData();
  }

  loadSellerData() {
    this.sellerService.getProfile().subscribe({
      next: (profile: any) => {
        if (profile) {
          this.sellerProfile = { ...this.sellerProfile, ...profile };
          this.editedProfile = { ...this.sellerProfile };
          this.isSellerRegistered = !!profile.isSellerRegistered;
          this.loadSellerStats();
        }
      }
    });
  }

  loadSellerStats() {
    this.sellerService.getStats().subscribe({
      next: (stats: any) => {
        if (stats) {
          this.stats = { ...this.stats, ...stats };
        }
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Seller Registration Methods
  registerAsSeller() {
    if (this.validateSellerProfile()) {
      this.sellerService.updateProfile(this.sellerProfile).subscribe({
        next: (profile: any) => {
          this.sellerProfile = { ...this.sellerProfile, ...profile };
          this.isSellerRegistered = true;
          this.activeTab = 'dashboard';
          this.sellerService.updateStats(this.stats).subscribe();
        }
      });
    }
  }

  validateSellerProfile(): boolean {
    if (
      !this.sellerProfile.businessName ||
      !this.sellerProfile.category ||
      !this.sellerProfile.gstNumber ||
      !this.sellerProfile.bankAccount ||
      !this.sellerProfile.ifscCode
    ) {
      return false;
    }
    return true;
  }

  // Edit Seller Profile
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editedProfile = { ...this.sellerProfile };
    }
  }

  saveProfile() {
    if (this.validateSellerProfile()) {
      this.sellerService.updateProfile(this.editedProfile).subscribe({
        next: (profile: any) => {
          this.sellerProfile = { ...this.sellerProfile, ...profile };
          this.editMode = false;
        }
      });
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.editedProfile = { ...this.sellerProfile };
  }
}

