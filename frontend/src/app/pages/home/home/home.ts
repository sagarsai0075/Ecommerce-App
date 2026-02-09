import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {

constructor(
  public authService: AuthService,
  private router: Router
) {}


  // ================= VIEW CHILD =================
  @ViewChild('productContainer') productContainer!: ElementRef;

  // ================= PRODUCTS =================
  phones: any[] = [];
  infinitePhones: any[] = [];

  // ================= CAROUSEL =================
  currentSlide = 0;
  totalSlides = 5;
  intervalId: any;
  isPaused = false;
  quantities: { [key: string]: number } = {};
addedMap: { [key: string]: boolean } = {};


  // ================= LIFE CYCLE =================

  ngOnInit() {
    this.startAutoSlide();   // banner only
    this.loadPhones();       // products manual
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  // ================= PRODUCT SCROLL (MANUAL ONLY) =================

  scrollLeft() {
    const container = this.productContainer.nativeElement;

    container.scrollBy({
      left: -300,
      behavior: 'smooth'
    });

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.fixInfiniteEdges();
      });
    }, 300);
  }

  scrollRight() {
    const container = this.productContainer.nativeElement;

    container.scrollBy({
      left: 300,
      behavior: 'smooth'
    });

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.fixInfiniteEdges();
      });
    }, 300);
  }

  fixInfiniteEdges() {

    const container = this.productContainer.nativeElement;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const current = container.scrollLeft;

    // RIGHT edge → jump back silently
    if (current >= maxScroll - 5) {
      container.scrollLeft = container.scrollWidth / 3;
    }

    // LEFT edge → jump forward silently
    if (current <= 5) {
      container.scrollLeft = container.scrollWidth / 2;
    }
  }

addToCart(product: any) {

  const qty = this.quantities[product.name] || 1;

  let cart: any[] = [];
  const storedCart = localStorage.getItem('cart');

  if (storedCart) {
    cart = JSON.parse(storedCart);
  }

  const existing = cart.find(
    item => item.name === product.name
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      ...product,
      qty: qty
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // Mark as added
  this.addedMap[product.name] = true;
  this.router.navigate(['/cart']);
}





  // ================= CAROUSEL =================

  startAutoSlide() {

    this.stopAutoSlide();

    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlideAuto();
      }
    }, 2000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  pauseAutoSlide() {
    this.isPaused = true;
  }

  resumeAutoSlide() {
    this.isPaused = false;
  }

  nextSlideAuto() {
    this.currentSlide =
      (this.currentSlide + 1) % this.totalSlides;
  }

  nextSlide() {
    this.pauseTemporarily();
    this.currentSlide =
      (this.currentSlide + 1) % this.totalSlides;
  }

  prevSlide() {
    this.pauseTemporarily();
    this.currentSlide =
      (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }

  pauseTemporarily() {
    this.isPaused = true;
    setTimeout(() => {
      this.isPaused = false;
    }, 5000);
  }

  // ================= PRICE =================

  getDiscountedPrice(price: number, discount: number): number {
    return Math.round(price - (price * discount / 100));
  }

  // ================= LOAD PRODUCTS =================

  loadPhones() {

    this.phones = [

      {
        name: 'Samsung Galaxy S23',
        price: 74999,
        discount: 10,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg'
      },
      {
        name: 'iPhone 17 Pro Max',
        price: 159999,
        discount: 12,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg'
      },
      {
        name: 'OnePlus Nord 5',
        price: 49999,
        discount: 15,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord5.jpg'
      },
      {
        name: 'iPhone 15',
        price: 69999,
        discount: 5,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg'
      },
      {
        name: 'OnePlus 11',
        price: 56999,
        discount: 12,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg'
      },
      {
        name: 'Redmi Note 12',
        price: 15999,
        discount: 20,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-10-pro-fold--.jpg'
      },
      {
        name: 'Vivo V27',
        price: 32999,
        discount: 8,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v27.jpg'
      }

    ];

    // triple list = smoother infinite illusion
    this.infinitePhones = [...this.phones, ...this.phones, ...this.phones];

    // start from center
    setTimeout(() => {
      if (this.productContainer) {
        const container = this.productContainer.nativeElement;
        container.scrollLeft = container.scrollWidth / 3;
      }
    }, 0);
  }

}
