import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-home',   // ✅ THIS LINE FIXES EVERYTHING
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements OnInit, OnDestroy, AfterViewInit {

  private readonly repeatCount = 50;
  private readonly explicitProductPrices: Record<string, number> = {
    'Samsung|Samsung Galaxy S25 Ultra': 74999,
    'Apple|iPhone 17 Pro Max': 159999,
    'OnePlus|OnePlus Nord 5': 49999,
    'Apple|iPhone 15': 69999,
    'OnePlus|OnePlus 11': 56999,
    'Google|Google Pixel 10': 109999,
    'Vivo|Vivo V27': 32999,
    'Redmi|Redmi Note 12': 15999,
    'Dell|Dell Inspiron 15': 65999,
    'Dell|Dell Vostro 5620': 55999,
    'HP|HP Pavilion x360': 19999,
    'Asus|Asus ROG Strix G635': 55999,
    'Apple|Apple MacBook Air M2': 119999,
    'Dell|Dell Alienware 16X': 55999,
    'HP|HP Victus 15': 45999,
    'Acer|Acer Aspire 7': 49999,
    'Snitch|Snitch Slim Fit Shirt': 1999,
    'H&M|H&M Floral Print Dress': 2499,
    'Adidas|Adidas T-Shirt': 2999,
    'Puma|Puma Hoodie': 3499,
    'Adidas|Adidas Sneakers': 3999,
    'Swiss Military|Swiss Military Hanowa': 2899,
    'Armani Exchange|Armani Exchange Shirt': 2199,
    'Puma|Puma Backpack': 3299,
    'LG|LG Smart TV': 58999,
    'Sony|Sony Bravia 8 II OLED TV': 32999,
    'Samsung|Samsung Crystal 4K TV': 39999,
    'Xiaomi|Xiaomi 4K Smart TV': 28999,
    'Motorola|Motorola UHD Smart TV': 26999,
    'Toshiba|Toshiba C350 4K TV': 18999,
    'Xiaomi|Xiaomi X Series TV': 13999,
    'Acer|Acer M Series Smart TV': 64999,
    'IKEA|Brimnes Day Bed Frame': 45999,
    'IKEA|Mossjoen Wall Cabinet': 38999,
    'IKEA|Variera Shelf Insert': 8999,
    'IKEA|Brimnes Wardrobe': 12999,
    'IKEA|Loshult Trolley': 6999,
    'IKEA|Billy TV Storage Combination': 7999,
    'IKEA|Akterspring Table Lamp': 24999,
    'IKEA|Ytberg LED Cabinet Lighting': 4999,
    'Kent|Kent Aqua RO Purifier': 3499,
    'Crompton|Crompton Arno Neo 15-L Geyser': 4999,
    'Bajaj|Bajaj DX-6 1000 Watts Dry Iron': 8999,
    'Prestige|Prestige 1.5L Stainless Steel Electric Kettle': 2999,
    'Bajaj|Bajaj ATX 4 Pop-up Toaster': 1999,
    'Havells|Havells High Speed Ceiling Fan': 1499,
    'Philips|Philips HL7756 Mixer Grinder': 2799,
    'KENT|KENT Storm Vacuum Cleaner': 1699,
    'Avery|Atomic Habits': 599,
    'Plata|Rich Dad Poor Dad': 499,
    'Jaico|The Psychology of Money': 699,
    'Westland|Ikigai': 399,
    'HarperCollins|Think Like a Monk': 499,
    'Grand Central|Deep Work': 549,
    'Jaico|The Monk Who Sold His Ferrari': 549,
    'HarperOne|The Alchemist': 399
  };

  private readonly brandMultipliers: Record<string, number> = {
    Apple: 1.15,
    Samsung: 1.08,
    OnePlus: 1.06,
    Google: 1.1,
    Sony: 1.09,
    LG: 1.05,
    IKEA: 1.04
  };

constructor(
  public authService: AuthService,
  private router: Router,
  private cartService: CartService,
  private cdr: ChangeDetectorRef,
  private zone: NgZone
) {}


  // ================= VIEW CHILD =================
  @ViewChild('productContainer') productContainer!: ElementRef;
  @ViewChild('electronicsContainer') electronicsContainer!: ElementRef;
  @ViewChild('fashionContainer') fashionContainer!: ElementRef;
  @ViewChild('tvContainer') tvContainer!: ElementRef;
@ViewChild('homeContainer') homeContainer!: ElementRef;
@ViewChild('booksContainer') booksContainer!: ElementRef;
@ViewChild('kitchenContainer') kitchenContainer!: ElementRef;






  // ================= PRODUCTS =================
  phones: any[] = [];
  infinitePhones: any[] = [];
  electronics: any[] = [];
infiniteElectronics: any[] = [];
fashion: any[] = [];
infiniteFashion: any[] = [];
tv: any[] = [];
infiniteTv: any[] = [];

home: any[] = [];
infiniteHome: any[] = [];
books: any[] = [];
infiniteBooks: any[] = [];
kitchen: any[] = [];
infiniteKitchen: any[] = [];



  // ================= CAROUSEL =================
  currentSlide = 0;
  totalSlides = 5;
  intervalId: any;
  isPaused = false;
  quantities: { [key: string]: number } = {};
addedMap: { [key: string]: boolean } = {};
  currentYear: number = new Date().getFullYear();


  // ================= LIFE CYCLE =================

ngOnInit() {
  this.loadKitchen();
  this.loadPhones();
  this.loadElectronics();
  this.loadFashion();
  this.loadTv();
  this.loadHome();
  this.loadBooks();
}

ngAfterViewInit() {
  this.startAutoSlide();
}
scrollLeftBooks() {
  this.booksContainer.nativeElement.scrollBy({
    left: -300,
    behavior: 'smooth'
  });
}

scrollRightBooks() {
  this.booksContainer.nativeElement.scrollBy({
    left: 300,
    behavior: 'smooth'
  });
}

scrollLeftKitchen() {
  this.kitchenContainer.nativeElement.scrollBy({
    left: -300,
    behavior: 'smooth'
  });
}

scrollRightKitchen() {
  this.kitchenContainer.nativeElement.scrollBy({
    left: 300,
    behavior: 'smooth'
  });
}

loadKitchen() {

  this.kitchen = [

    {
      name: 'Kent Aqua RO Purifier',
      price: 3499,
      discount: 40,
      image: 'assets/Kitchen/Kent Aqua.jpg'
    },

    {
      name: 'Crompton Arno Neo 15-L Geyser',
      price: 4999,
      discount: 30,
      image: 'assets/Kitchen/Geyser.jpg'
    },

    {
      name: 'Bajaj DX-6 1000 Watts Dry Iron',
      price: 8999,
      discount: 35,
      image: 'assets/Kitchen/Iron.jpg'
    },

    {
      name: 'Prestige 1.5L Stainless Steel Electric Kettle',
      price: 2999,
      discount: 25,
      image: 'assets/Kitchen/Kettle.jpg'
    },

    {
      name: 'Bajaj ATX 4 Pop-up Toaster',
      price: 1999,
      discount: 20,
      image: 'assets/Kitchen/Toaster.jpg'
    },

    {
      name: 'Havells High Speed Ceiling Fan',
      price: 1499,
      discount: 28,
      image: 'assets/Kitchen/Fan.jpg'
    },

    {
      name: 'Philips HL7756 Mixer Grinder',
      price: 2799,
      discount: 22,
      image: 'assets/Kitchen/Mixer.jpg'
    },

    {
      name: 'KENT Storm Vacuum Cleaner',
      price: 1699,
      discount: 18,
      image: 'assets/Kitchen/Vaccum.jpg'
    }

  ];

  this.kitchen = this.applyBrandAndPrice(this.kitchen, 'kitchen');

  this.infiniteKitchen = this.buildInfinite(this.kitchen);

  setTimeout(() => {
    this.kitchenContainer.nativeElement.scrollLeft =
      this.kitchenContainer.nativeElement.scrollWidth / 2;
  }, 0);
}


loadBooks() {

  this.books = [

    {
      name: 'Atomic Habits',
      price: 599,
      discount: 40,
      image: 'assets/Books/Atomic Habits.jpg'
    },

    {
      name: 'Rich Dad Poor Dad',
      price: 499,
      discount: 35,
      image: 'assets/Books/Rich Dad Poor Dad.jpg'
    },

    {
      name: 'The Psychology of Money',
      price: 699,
      discount: 30,
      image: 'assets/Books/The Psychology of Money.jpg'
    },

    {
      name: 'Ikigai',
      price: 399,
      discount: 25,
      image: 'assets/Books/Ikigai.jpg'
    },

    {
      name: 'Think Like a Monk',
      price: 499,
      discount: 20,
      image: 'assets/Books/Think like a Monk.jpg'
    },

 
    {
      name: 'Deep Work',
      price: 549,
      discount: 18,
      image: 'assets/Books/Deep Work.webp'
    },
    {
      name: 'The Monk Who Sold His Ferrari',
      price: 549,
      discount: 18,
      image: 'assets/Books/The Monk Who Sold His Ferrari.jpg'
    },
    {
      name: 'The Alchemist',
      price: 399,
      discount: 25,
      image: 'assets/Books/The Alchemist.jpg'
    }

  ];

  this.books = this.applyBrandAndPrice(this.books, 'books');

  this.infiniteBooks = this.buildInfinite(this.books);

  setTimeout(() => {
    this.booksContainer.nativeElement.scrollLeft =
      this.booksContainer.nativeElement.scrollWidth / 2;
  }, 0);
}

scrollLeftHome() {
  this.homeContainer.nativeElement.scrollBy({
    left: -300,
    behavior: 'smooth'
  });
}

scrollRightHome() {
  this.homeContainer.nativeElement.scrollBy({
    left: 300,
    behavior: 'smooth'
  });
}


loadHome() {

  this.home = [

    {
      name: 'Brimnes Day Bed Frame',
      price: 45999,
      discount: 25,
      image: 'assets/Home/Bed.avif'
    },

    {
      name: 'Mossjoen Wall Cabinet',
      price: 38999,
      discount: 20,
      image: 'assets/Home/Wall Cabinet.avif'
    },

    {
      name: 'Variera Shelf Insert',
      price: 8999,
      discount: 30,
      image: 'assets/Home/Variera Shelf Insert.avif'
    },

    {
      name: 'Brimnes Wardrobe',
      price: 12999,
      discount: 35,
      image: 'assets/Home/Brimnes Wardrobe.avif'
    },

    {
      name: 'Loshult Trolley',
      price: 6999,
      discount: 15,
      image: 'assets/Home/Trolley.avif'
    },

    {
      name: 'Billy TV Storage Combination',
      price: 7999,
      discount: 18,
      image: 'assets/Home/Billy TV.avif'
    },

    {
      name: 'Akterspring Table Lamp',
      price: 24999,
      discount: 22,
      image: 'assets/Home/Table lamp.avif'
    },

    {
      name: 'Ytberg LED Cabinet Lighting',
      price: 4999,
      discount: 16,
      image: 'assets/Home/LED Cabin Light.avif'
    }

  ];

  this.home = this.applyBrandAndPrice(this.home, 'home');

  this.infiniteHome = this.buildInfinite(this.home);

  setTimeout(() => {
    this.homeContainer.nativeElement.scrollLeft =
      this.homeContainer.nativeElement.scrollWidth / 2;
  }, 0);
}

scrollLeftTv() {
  this.tvContainer.nativeElement.scrollBy({
    left: -300,
    behavior: 'smooth'
  });
}

scrollRightTv() {
  this.tvContainer.nativeElement.scrollBy({
    left: 300,
    behavior: 'smooth'
  });
}
loadTv() {

  this.tv = [

    {
      name: 'LG Smart TV',
      price: 58999,
      discount: 22,
      image: 'assets/TV/LG TV.avif'
    },

    {
      name: 'Sony Bravia 8 II OLED TV',
      price: 32999,
      discount: 18,
      image: 'assets/TV/Sony TV.avif'
    },

    {
      name: 'Samsung Crystal 4K TV',
      price: 39999,
      discount: 25,
      image: 'assets/TV/Samsung TV.avif'
    },

    {
      name: 'Xiaomi 4K Smart TV',
      price: 28999,
      discount: 20,
      image: 'assets/TV/Xiaomi TV.avif'
    },

    {
      name: 'Motorola UHD Smart TV',
      price: 26999,
      discount: 15,
      image: 'assets/TV/Moto TV.avif'
    },

    {
      name: 'Toshiba C350 4K TV',
      price: 18999,
      discount: 20,
      image: 'assets/TV/Toshiba TV.avif'
    },

    {
      name: 'Xiaomi X Series TV',
      price: 13999,
      discount: 17,
      image: 'assets/TV/Xiaomi TV 2.avif'
    },

    {
      name: 'Acer M Series Smart TV',
      price: 64999,
      discount: 19,
      image: 'assets/TV/Acer TV.avif'
    }

  ];

  this.tv = this.applyBrandAndPrice(this.tv, 'tv');

  this.infiniteTv = this.buildInfinite(this.tv);

  setTimeout(() => {
    this.tvContainer.nativeElement.scrollLeft =
      this.tvContainer.nativeElement.scrollWidth / 2;
  }, 0);
}



  ngOnDestroy() {
    this.stopAutoSlide();
  }
scrollLeftFashion() {

  const container = this.fashionContainer.nativeElement;

  container.scrollBy({
    left: -300,
    behavior: 'smooth'
  });
}

scrollRightFashion() {

  const container = this.fashionContainer.nativeElement;

  container.scrollBy({
    left: 300,
    behavior: 'smooth'
  });
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

  scrollLeftElectronics() {

  const container = this.electronicsContainer.nativeElement;

  container.scrollBy({
    left: -300,
    behavior: 'smooth'
  });
}

scrollRightElectronics() {

  const container = this.electronicsContainer.nativeElement;

  container.scrollBy({
    left: 300,
    behavior: 'smooth'
  });
}
loadElectronics() {

  this.electronics = [

    {
      name: 'Dell Inspiron 15',
      price: 65999,
      discount: 15,
      image: 'assets/Electronics/Dell Inspiron.avif'
    },

  

    {
      name: 'Dell Vostro 5620',
      price: 55999,
      discount: 10,
      image: 'assets/Electronics/Dell Vostro 1.avif'
    },
 {
      name: 'HP Pavilion x360',
      price: 19999,
      discount: 20,
      image: 'assets/Electronics/HP Pavilion.avif'
    },
    
    {
      name: 'Asus ROG Strix G635',
      price: 55999,
      discount: 10,
      image: 'assets/Electronics/Asus Rog.avif'
    },
     {
      name: 'Apple MacBook Air M2',
      price: 119999,
      discount: 10,
      image: 'assets/Electronics/Apple Macbook.avif'
    },
    {
      name: 'Dell Alienware 16X',
      price: 55999,
      discount: 10,
      image: 'assets/Electronics/Dell Alien.avif'
    },
    {
      name: 'HP Victus 15',
      price: 45999,
      discount: 15,
      image: 'assets/Electronics/HP Victus.avif'
    },
    {
      name: 'Acer Aspire 7',
      price: 49999,
      discount: 10,
      image: 'assets/Electronics/Acer Aspire.avif'
    },
   
  ];

  this.electronics = this.applyBrandAndPrice(this.electronics, 'electronics');

  this.infiniteElectronics = this.buildInfinite(this.electronics);

  setTimeout(() => {
    if (this.electronicsContainer) {
      const container = this.electronicsContainer.nativeElement;
      container.scrollLeft = container.scrollWidth / 2;
    }
  }, 0);
}


  fixInfiniteEdges() {

    const container = this.productContainer.nativeElement;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const current = container.scrollLeft;

    // RIGHT edge → jump back silently
    if (current >= maxScroll - 5) {
      container.scrollLeft = container.scrollWidth / 2;
    }

    // LEFT edge → jump forward silently
    if (current <= 5) {
      container.scrollLeft = container.scrollWidth / 2;
    }
  }

addToCart(product: any) {

  const qty = this.quantities[product.name] || 1;

  this.cartService.addToCart(product, qty).subscribe({
    next: () => {
      this.addedMap[product.name] = true;
      this.router.navigate(['/cart']);
    },
    error: () => {
      this.cartService.addToLocalCart(product, qty).subscribe({
        next: () => {
          this.addedMap[product.name] = true;
          this.router.navigate(['/cart']);
        }
      });
    }
  });
}





  // ================= CAROUSEL =================

  startAutoSlide() {

    this.stopAutoSlide();

    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.zone.run(() => {
          this.nextSlideAuto();
          this.cdr.markForCheck();
        });
      }
    }, 2500);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
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
loadFashion() {

  this.fashion = [

    {
      name: 'Snitch Slim Fit Shirt',
      price: 1999,
      discount: 30,
      image: 'assets/Fashion/Snitch shirt.avif'
    },

    {
      name: ' H&M Floral Print Dress',
      price: 2499,
      discount: 35,
      image: 'assets/Fashion/H&M Floral.avif'
    },

    {
      name: 'Adidas T-Shirt',
      price: 2999,
      discount: 25,
      image: 'assets/Fashion/Adidas T-Shirt.avif'
    },

    {
      name: 'Puma Hoodie',
      price: 3499,
      discount: 40,
      image: 'assets/Fashion/Puma Hoodie.avif'
    },

    {
      name: 'Adidas Sneakers',
      price: 3999,
      discount: 20,
      image: 'assets/Fashion/Adidas Sneakers.avif'
    },

    {
      name: 'Swiss Military Hanowa',
      price: 2899,
      discount: 22,
      image: 'assets/Fashion/Swiss Military.avif'
    },

    {
      name: 'Armani Exchange Shirt',
      price: 2199,
      discount: 26,
      image: 'assets/Fashion/Armani Exchange.avif'
    },

    {
      name: 'Puma Backpack',
      price: 3299,
      discount: 24,
      image: 'assets/Fashion/Puma Backpack.avif'
    }

  ];

  this.fashion = this.applyBrandAndPrice(this.fashion, 'fashion');

  this.infiniteFashion = [
    ...this.fashion,
    ...this.fashion,
    ...this.fashion
  ];

  setTimeout(() => {
    if (this.fashionContainer) {
      const container = this.fashionContainer.nativeElement;
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, 0);
}

  // ================= PRICE =================

  getDiscountedPrice(price: number, discount: number): number {
    return Math.round(price - (price * discount / 100));
  }

  private applyBrandAndPrice(products: any[], category: string): any[] {
    return products.map(product => {
      const normalizedName = String(product?.name || '').trim();
      const brand = this.resolveBrand(normalizedName, category);
      const price = this.getPriceByBrandAndProduct(brand, normalizedName, Number(product?.price || 0));

      return {
        ...product,
        name: normalizedName,
        brand,
        price
      };
    });
  }

  private getPriceByBrandAndProduct(brand: string, productName: string, fallbackPrice: number): number {
    const key = `${brand}|${productName}`;
    const exactPrice = this.explicitProductPrices[key];

    if (exactPrice !== undefined) {
      return exactPrice;
    }

    const multiplier = this.brandMultipliers[brand] ?? 1;
    return Math.max(1, Math.round(fallbackPrice * multiplier));
  }

  private resolveBrand(productName: string, category: string): string {
    const lowerName = productName.toLowerCase();

    const nameToBrand: Array<{ token: string; brand: string }> = [
      { token: 'samsung', brand: 'Samsung' },
      { token: 'iphone', brand: 'Apple' },
      { token: 'apple', brand: 'Apple' },
      { token: 'oneplus', brand: 'OnePlus' },
      { token: 'google', brand: 'Google' },
      { token: 'pixel', brand: 'Google' },
      { token: 'vivo', brand: 'Vivo' },
      { token: 'redmi', brand: 'Redmi' },
      { token: 'dell', brand: 'Dell' },
      { token: 'hp', brand: 'HP' },
      { token: 'asus', brand: 'Asus' },
      { token: 'acer', brand: 'Acer' },
      { token: 'snitch', brand: 'Snitch' },
      { token: 'h&m', brand: 'H&M' },
      { token: 'adidas', brand: 'Adidas' },
      { token: 'puma', brand: 'Puma' },
      { token: 'swiss military', brand: 'Swiss Military' },
      { token: 'armani exchange', brand: 'Armani Exchange' },
      { token: 'lg', brand: 'LG' },
      { token: 'sony', brand: 'Sony' },
      { token: 'xiaomi', brand: 'Xiaomi' },
      { token: 'motorola', brand: 'Motorola' },
      { token: 'toshiba', brand: 'Toshiba' },
      { token: 'brimnes', brand: 'IKEA' },
      { token: 'mossjoen', brand: 'IKEA' },
      { token: 'variera', brand: 'IKEA' },
      { token: 'loshult', brand: 'IKEA' },
      { token: 'billy', brand: 'IKEA' },
      { token: 'akterspring', brand: 'IKEA' },
      { token: 'ytberg', brand: 'IKEA' },
      { token: 'kent', brand: 'Kent' },
      { token: 'crompton', brand: 'Crompton' },
      { token: 'bajaj', brand: 'Bajaj' },
      { token: 'prestige', brand: 'Prestige' },
      { token: 'havells', brand: 'Havells' },
      { token: 'philips', brand: 'Philips' },
      { token: 'atomic habits', brand: 'Avery' },
      { token: 'rich dad poor dad', brand: 'Plata' },
      { token: 'psychology of money', brand: 'Jaico' },
      { token: 'ikigai', brand: 'Westland' },
      { token: 'think like a monk', brand: 'HarperCollins' },
      { token: 'deep work', brand: 'Grand Central' },
      { token: 'monk who sold his ferrari', brand: 'Jaico' },
      { token: 'alchemist', brand: 'HarperOne' }
    ];

    const match = nameToBrand.find(entry => lowerName.includes(entry.token));
    if (match) {
      return match.brand;
    }

    const categoryDefaults: Record<string, string> = {
      mobiles: 'Generic',
      electronics: 'Generic',
      fashion: 'Generic',
      tv: 'Generic',
      home: 'IKEA',
      books: 'Generic Publisher',
      kitchen: 'Generic'
    };

    return categoryDefaults[category] ?? 'Generic';
  }

  getRating(product: any): string {
    const name = String(product.name || '');
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
      hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    const rating = 4.0 + (hash % 91) / 100;
    return rating.toFixed(1);
  }

  getRatingCount(product: any): string {
    const name = String(product.name || '');
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
      hash = (hash * 37 + name.charCodeAt(i)) >>> 0;
    }
    const count = 10000 + (hash % 40001);
    return count.toLocaleString('en-IN');
  }


  // ================= LOAD PRODUCTS =================

  loadPhones() {

    this.phones = [

      {
        name: 'Samsung Galaxy S25 Ultra',
        price: 74999,
        discount: 10,
        image: 'assets/Mobiles/Samsung Galaxy S25 Ultra.jpg'
      },
      {
        name: 'iPhone 17 Pro Max',
        price: 159999,
        discount: 12,
        image: 'assets/Mobiles/Iphone 17 pro max.jpg'
      },
      {
        name: 'OnePlus Nord 5',
        price: 49999,
        discount: 15,
        image: 'assets/Mobiles/Oneplus Nord 5.jpg'
      },
      {
        name: 'iPhone 15',
        price: 69999,
        discount: 5,
        image: 'assets/Mobiles/Iphone 15.jpg'
      },
      {
        name: 'OnePlus 11',
        price: 56999,
        discount: 12,
        image: 'assets/Mobiles/Oneplus 11.jpg'
      },
      {
        name: 'Google Pixel 10 ',
        price: 109999,
        discount: 18,
        image: 'assets/Mobiles/Google Pixel 10.jpg'
      },
      {
        name: 'Vivo V27',
        price: 32999,
        discount: 8,
        image: 'assets/Mobiles/Vivo V27.jpg'
      },
      {
        name: 'Redmi Note 12',
        price: 15999,
        discount: 20,
        image: 'assets/Mobiles/Redmi Note 12.jpg'
      }
      

    ];

    this.phones = this.applyBrandAndPrice(this.phones, 'mobiles');

    this.infinitePhones = this.buildInfinite(this.phones);

    // start from center
    setTimeout(() => {
      if (this.productContainer) {
        const container = this.productContainer.nativeElement;
        container.scrollLeft = container.scrollWidth / 2;
      }
    }, 0);
  }

  private buildInfinite(list: any[]): any[] {
    return Array.from({ length: this.repeatCount }, () => list).flat();
  }

}
