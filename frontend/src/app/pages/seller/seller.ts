import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadSellerData();
  }

  loadSellerData() {
    const sellerData = localStorage.getItem('sellerProfile');
    if (sellerData) {
      this.sellerProfile = JSON.parse(sellerData);
      this.isSellerRegistered = true;
      this.loadSellerStats();
    }
  }

  loadSellerStats() {
    // Load stats from localStorage or backend
    const statsData = localStorage.getItem('sellerStats');
    if (statsData) {
      this.stats = JSON.parse(statsData);
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Seller Registration Methods
  registerAsSeller() {
    if (this.validateSellerProfile()) {
      localStorage.setItem('sellerProfile', JSON.stringify(this.sellerProfile));
      localStorage.setItem('sellerStats', JSON.stringify(this.stats));
      this.isSellerRegistered = true;
      this.activeTab = 'dashboard';
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
      this.sellerProfile = { ...this.editedProfile };
      localStorage.setItem('sellerProfile', JSON.stringify(this.sellerProfile));
      this.editMode = false;
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.editedProfile = { ...this.sellerProfile };
  }
}

