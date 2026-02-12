import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products implements OnInit {

  category = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  displayedProducts: any[] = [];
  allBrands: string[] = [];
  availableBrands: string[] = [];
  availablePriceRanges: Array<{ id: string; label: string }> = [];
  availableRatings: number[] = [];
  isLoading = false;
  itemsPerPage = 10;
  currentPage = 1;
  compareList: any[] = [];
  compareKeySet = new Set<string>();
  compareError = '';

  priceRangeOptions = [
    { id: '0-500', label: '₹0 – ₹500' },
    { id: '500-1000', label: '₹500 – ₹1,000' },
    { id: '1000-2000', label: '₹1,000 – ₹2,000' },
    { id: '2000-5000', label: '₹2,000 – ₹5,000' },
    { id: '5000-10000', label: '₹5,000 – ₹10,000' },
    { id: '10000-20000', label: '₹10,000 – ₹20,000' },
    { id: '20000-50000', label: '₹20,000 – ₹50,000' },
    { id: '50000-100000', label: '₹50,000 – ₹1,00,000' },
    { id: '100000-500000', label: '₹1,00,000 – ₹5,00,000' }
  ];

  ratingOptions = [4, 3, 2];

  filters = {
    sort: '',
    priceRanges: [] as string[],
    brands: [] as string[],
    ratings: [] as number[]
  };

  // ✅ ALL PRODUCTS MOVED FROM HOME
  allProducts: any = {

    mobiles: [
      {
        name: 'Samsung Galaxy S23',
        brand: 'Samsung',
        price: 74999,
        discount: 10,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg',
        specifications: ['6.8" Dynamic AMOLED Display', 'Snapdragon 8 Gen 2 Processor', '50MP Triple Camera Setup', '5000mAh Battery with Fast Charging'],
        rating: 4.6,
        reviewsCount: 2847
      },
      {
        name: 'iPhone 17 Pro Max',
        brand: 'Apple',
        price: 159999,
        discount: 12,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg',
        specifications: ['6.7" ProMotion OLED Display', 'A18 Pro Chip with 8GB RAM', '48MP Pro Camera System with 8K Video', 'Titanium Frame with Ceramic Shield'],
        rating: 4.8,
        reviewsCount: 5621
      },
      {
        name: 'OnePlus Nord 5',
        brand: 'OnePlus',
        price: 49999,
        discount: 15,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord5.jpg',
        specifications: ['6.5" 120Hz AMOLED Display', 'MediaTek Dimensity 9000', '64MP Triple Camera', '4500mAh with 80W SuperVOOC Charging'],
        rating: 4.4,
        reviewsCount: 1523
      },
      {
        name: 'iPhone 15',
        brand: 'Apple',
        price: 69999,
        discount: 5,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg',
        specifications: ['6.1" Super Retina XDR Display', 'A16 Bionic Chip', '48MP Main + 12MP Ultra Wide Camera', 'USB-C Port with MagSafe Support'],
        rating: 4.7,
        reviewsCount: 4392
      },
      {
        name: 'OnePlus 11',
        brand: 'OnePlus',
        price: 56999,
        discount: 12,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg',
        specifications: ['6.7" QHD+ 120Hz AMOLED', 'Snapdragon 8 Gen 2', '50MP Hasselblad Camera System', '5000mAh with 100W SuperVOOC'],
        rating: 4.5,
        reviewsCount: 2156
      },
      {
        name: 'Redmi Note 12',
        brand: 'Redmi',
        price: 15999,
        discount: 20,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-10-pro-fold--.jpg',
        specifications: ['6.67" FHD+ 120Hz Display', 'Snapdragon 685 Processor', '48MP Triple Camera', '5000mAh with 33W Fast Charging'],
        rating: 4.3,
        reviewsCount: 8734
      },
      {
        name: 'Vivo V27',
        brand: 'Vivo',
        price: 32999,
        discount: 8,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v27.jpg',
        specifications: ['6.78" AMOLED Display', 'MediaTek Dimensity 7200', '50MP OIS Camera + 50MP Selfie', 'Color Changing Design, 4600mAh Battery'],
        rating: 4.2,
        reviewsCount: 1876
      }
    ],

    electronics: [
      {
        name: 'Dell Laptop',
        brand: 'Dell',
        price: 65999,
        discount: 15,
        image: 'https://m.media-amazon.com/images/I/61fDHkQ6MqL._SX679_.jpg',
        specifications: ['15.6" FHD Anti-Glare Display', 'Intel Core i5 12th Gen', '8GB RAM, 512GB SSD', 'Windows 11, 6 Hour Battery Life'],
        rating: 4.4,
        reviewsCount: 1245
      },
      {
        name: 'Sony Headphones',
        brand: 'Sony',
        price: 19999,
        discount: 20,
        image: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._SX679_.jpg',
        specifications: ['Active Noise Cancellation', 'Bluetooth 5.2 with LDAC Support', '30 Hour Battery Life', 'Premium Comfortable Over-Ear Design'],
        rating: 4.7,
        reviewsCount: 3562
      },
      {
        name: 'Canon Camera',
        brand: 'Canon',
        price: 55999,
        discount: 10,
        image: 'https://m.media-amazon.com/images/I/71EWRyqzw0L._SX679_.jpg',
        specifications: ['24.1MP APS-C CMOS Sensor', 'DIGIC 8 Image Processor', '45-Point All Cross-Type AF System', 'Full HD 1080p Video Recording'],
        rating: 4.6,
        reviewsCount: 987
      },
      {
        name: 'JBL Speaker',
        brand: 'JBL',
        price: 7999,
        discount: 25,
        image: 'https://m.media-amazon.com/images/I/61J9B4p8YkL._SX679_.jpg',
        specifications: ['Bluetooth 5.1 Connectivity', 'IPX7 Waterproof Rating', '12 Hours Playtime', 'PartyBoost for Speaker Pairing'],
        rating: 4.5,
        reviewsCount: 4521
      },
      {
        name: 'Samsung Monitor',
        brand: 'Samsung',
        price: 17999,
        discount: 18,
        image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._SX679_.jpg',
        specifications: ['27" QHD 1440p Curved Display', '144Hz Refresh Rate', 'AMD FreeSync Premium', 'Height Adjustable Stand, HDMI & DP'],
        rating: 4.3,
        reviewsCount: 2134
      }
    ],

    fashion: [
      {
        name: 'Men Casual Shirt',
        brand: 'Allen Solly',
        price: 1999,
        discount: 30,
        image: 'https://m.media-amazon.com/images/I/71T3K9ZB7WL._UY879_.jpg',
        specifications: ['100% Premium Cotton Fabric', 'Slim Fit Design', 'Wrinkle-Resistant Material', 'Size: S, M, L, XL, XXL Available'],
        rating: 4.1,
        reviewsCount: 6782
      },
      {
        name: 'Women Kurti',
        brand: 'Libas',
        price: 2499,
        discount: 35,
        image: 'https://m.media-amazon.com/images/I/71G0C5GvMQL._UY879_.jpg',
        specifications: ['Rayon Blend Fabric', 'A-Line Pattern with Embroidery', 'Machine Washable', 'Sizes: XS, S, M, L, XL, XXL'],
        rating: 4.4,
        reviewsCount: 5421
      },
      {
        name: 'Men Jeans',
        brand: 'Levis',
        price: 2999,
        discount: 25,
        image: 'https://m.media-amazon.com/images/I/71F8d1kZ6ML._UY879_.jpg',
        specifications: ['Stretchable Denim Fabric', 'Regular Fit Design', 'Mid Rise with 5 Pockets', 'Waist: 28-42 inches Available'],
        rating: 4.2,
        reviewsCount: 4932
      },
      {
        name: 'Women Handbag',
        brand: 'Baggit',
        price: 3499,
        discount: 40,
        image: 'https://m.media-amazon.com/images/I/61V+4WRoE3L._UY879_.jpg',
        specifications: ['Premium Vegan Leather Material', 'Multiple Compartments with Zipper', 'Adjustable Shoulder Strap', 'Dimensions: 35cm x 28cm x 12cm'],
        rating: 4.3,
        reviewsCount: 3298
      },
      {
        name: 'Running Shoes',
        brand: 'Adidas',
        price: 3999,
        discount: 20,
        image: 'https://m.media-amazon.com/images/I/71p1C7P6lWL._UY879_.jpg',
        specifications: ['Breathable Mesh Upper', 'EVA Midsole Cushioning', 'Anti-Slip Rubber Outsole', 'UK Size: 6-12 Available'],
        rating: 4.5,
        reviewsCount: 7856
      }
    ],

    tv: [
      {
        name: 'Samsung 55" Smart TV',
        brand: 'Samsung',
        price: 58999,
        discount: 22,
        image: 'https://m.media-amazon.com/images/I/71S8U9VzLTL._SX679_.jpg',
        specifications: ['55" Crystal 4K UHD Display', 'Smart Hub with Streaming Apps', '3 HDMI & 2 USB Ports', '20W Dolby Digital Plus Audio'],
        rating: 4.6,
        reviewsCount: 3456
      },
      {
        name: 'LG Washing Machine',
        brand: 'LG',
        price: 32999,
        discount: 18,
        image: 'https://m.media-amazon.com/images/I/71+K9h5C5WL._SX679_.jpg',
        specifications: ['7.5 kg Fully Automatic', 'AI Direct Drive Technology', '6 Motion DD & Smart Diagnosis', '5 Star Energy Rating'],
        rating: 4.4,
        reviewsCount: 2187
      },
      {
        name: 'Voltas Split AC',
        brand: 'Voltas',
        price: 39999,
        discount: 25,
        image: 'https://m.media-amazon.com/images/I/61C3zZJtGWL._SX679_.jpg',
        specifications: ['1.5 Ton Inverter Split AC', '5 Star Energy Rating', 'Copper Condenser, Turbo Mode', 'Smart Wi-Fi Control with App'],
        rating: 4.3,
        reviewsCount: 1654
      },
      {
        name: 'Whirlpool Refrigerator',
        brand: 'Whirlpool',
        price: 28999,
        discount: 20,
        image: 'https://m.media-amazon.com/images/I/71Zf9uUp+GL._SX679_.jpg',
        specifications: ['265L Double Door Refrigerator', 'Intellisense Inverter Technology', '3 Star Energy Rating', 'Convertible Freezer Mode'],
        rating: 4.2,
        reviewsCount: 2891
      },
      {
        name: 'Mi 43" Android TV',
        brand: 'Mi',
        price: 26999,
        discount: 15,
        image: 'https://m.media-amazon.com/images/I/71cYtZb8wDL._SX679_.jpg',
        specifications: ['43" Full HD LED Display', 'Android TV 11 with Google Assistant', 'Built-in Chromecast', '20W Stereo Speakers, 3 HDMI Ports'],
        rating: 4.4,
        reviewsCount: 9234
      }
    ],

    home: [
      {
        name: 'Wooden Sofa Set',
        brand: 'Urban Ladder',
        price: 45999,
        discount: 25,
        image: 'https://m.media-amazon.com/images/I/81Jzv5KJ7WL._SX679_.jpg',
        specifications: ['3+2 Seater Sheesham Wood', 'High-Density Foam Cushions', 'Fabric/Leatherette Upholstery', 'Dimensions: 180cm x 85cm x 90cm'],
        rating: 4.5,
        reviewsCount: 876
      },
      {
        name: 'King Size Bed',
        brand: 'Wakefit',
        price: 38999,
        discount: 20,
        image: 'https://m.media-amazon.com/images/I/81pZ7C8F6PL._SX679_.jpg',
        specifications: ['King Size: 183cm x 203cm', 'Engineered Wood Frame', 'Cushioned Headboard', 'Box Storage Option Available'],
        rating: 4.3,
        reviewsCount: 1234
      },
      {
        name: 'Study Table',
        brand: 'Nilkamal',
        price: 8999,
        discount: 30,
        image: 'https://m.media-amazon.com/images/I/71kQ9+KJZEL._SX679_.jpg',
        specifications: ['Particle Board with Laminate Finish', '2 Drawers + Open Shelf', 'Cable Management System', 'Dimensions: 120cm x 60cm x 75cm'],
        rating: 4.1,
        reviewsCount: 2567
      },
      {
        name: 'Office Chair',
        brand: 'Green Soul',
        price: 12999,
        discount: 35,
        image: 'https://m.media-amazon.com/images/I/71QqT7M2pKL._SX679_.jpg',
        specifications: ['Ergonomic Design with Lumbar Support', 'Height Adjustable: 45-53cm', 'Mesh Back, PU Leather Seat', '360° Swivel with Smooth Casters'],
        rating: 4.4,
        reviewsCount: 3421
      },
      {
        name: 'Bookshelf Rack',
        brand: 'Amazon Brand',
        price: 6999,
        discount: 15,
        image: 'https://m.media-amazon.com/images/I/71aQpKJx+BL._SX679_.jpg',
        specifications: ['5-Tier Open Shelving Design', 'Engineered Wood Construction', 'Load Capacity: 15kg per shelf', 'Dimensions: 75cm x 30cm x 180cm'],
        rating: 4.2,
        reviewsCount: 1845
      }
    ],

    books: [
      {
        name: 'Atomic Habits',
        brand: 'Penguin',
        price: 599,
        discount: 40,
        image: 'https://m.media-amazon.com/images/I/91bYsX41DVL.jpg',
        specifications: ['Author: James Clear', 'Paperback - 320 Pages', 'Publisher: Penguin Random House', 'Language: English ISBN: 9780735211292'],
        rating: 4.8,
        reviewsCount: 12453
      },
      {
        name: 'Rich Dad Poor Dad',
        brand: 'Plata',
        price: 499,
        discount: 35,
        image: 'https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg',
        specifications: ['Author: Robert T. Kiyosaki', 'Paperback - 336 Pages', 'Publisher: Plata Publishing', 'Language: English'],
        rating: 4.7,
        reviewsCount: 18762
      },
      {
        name: 'The Psychology of Money',
        brand: 'Harriman House',
        price: 699,
        discount: 30,
        image: 'https://m.media-amazon.com/images/I/71g2ednj0JL.jpg',
        specifications: ['Author: Morgan Housel', 'Paperback - 256 Pages', 'Publisher: Harriman House', 'Language: English'],
        rating: 4.6,
        reviewsCount: 9823
      },
      {
        name: 'Ikigai',
        brand: 'Penguin',
        price: 399,
        discount: 25,
        image: 'https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg',
        specifications: ['Authors: Héctor García & Francesc Miralles', 'Paperback - 208 Pages', 'Publisher: Penguin Books', 'Language: English'],
        rating: 4.5,
        reviewsCount: 7654
      },
      {
        name: 'Think Like a Monk',
        brand: 'Simon & Schuster',
        price: 499,
        discount: 20,
        image: 'https://m.media-amazon.com/images/I/71b1cZV5jKL.jpg',
        specifications: ['Author: Jay Shetty', 'Paperback - 352 Pages', 'Publisher: Simon & Schuster', 'Language: English'],
        rating: 4.6,
        reviewsCount: 6234
      }
    ],

    kitchen: [
      {
        name: 'Non-Stick Cookware Set',
        brand: 'Prestige',
        price: 3499,
        discount: 40,
        image: 'https://m.media-amazon.com/images/I/81+vY7fZsFL._SX679_.jpg',
        specifications: ['7-Piece Set (3 Pans, 3 Lids, 1 Kadai)', 'Non-Stick Coating, Induction Safe', 'Aluminum Body with Bakelite Handle', 'Dishwasher Safe, 2 Year Warranty'],
        rating: 4.3,
        reviewsCount: 5432
      },
      {
        name: 'Mixer Grinder',
        brand: 'Philips',
        price: 4999,
        discount: 30,
        image: 'https://m.media-amazon.com/images/I/71Zf9uUp+GL._SX679_.jpg',
        specifications: ['750W Powerful Motor', '3 Stainless Steel Jars (0.4L, 1L, 1.5L)', 'Overload Protection', '2 Year Warranty on Motor'],
        rating: 4.4,
        reviewsCount: 3876
      },
      {
        name: 'Air Fryer',
        brand: 'Philips',
        price: 8999,
        discount: 35,
        image: 'https://m.media-amazon.com/images/I/71qKzqk6YFL._SX679_.jpg',
        specifications: ['4.5L Large Capacity', '1400W Rapid Air Technology', 'Digital Touch Controls with 8 Presets', 'Temperature Range: 80-200°C'],
        rating: 4.5,
        reviewsCount: 6892
      },
      {
        name: 'Steel Dinner Set',
        brand: 'Milton',
        price: 2999,
        discount: 25,
        image: 'https://m.media-amazon.com/images/I/71kZcZk0nZL._SX679_.jpg',
        specifications: ['24-Piece Set (6 Each: Plates, Bowls, Glasses, Spoons)', 'Food Grade Stainless Steel', 'Mirror Finish, Rust Resistant', 'Dishwasher Safe'],
        rating: 4.2,
        reviewsCount: 4321
      },
      {
        name: 'Electric Kettle',
        brand: 'Prestige',
        price: 1999,
        discount: 20,
        image: 'https://m.media-amazon.com/images/I/61s7y3JzLKL._SX679_.jpg',
        specifications: ['1.8L Capacity, 1500W Power', 'Stainless Steel Body', 'Auto Shut-off & Boil Dry Protection', '360° Swivel Base, Cordless Design'],
        rating: 4.3,
        reviewsCount: 7821
      }
    ]

  };

  ngOnInit() {

    this.route.params.subscribe(params => {

      this.category = params['category'];

      const originalProducts = this.allProducts[this.category] || [];
      this.products = this.multiplyProducts(originalProducts, 10);
      this.itemsPerPage = this.products.length;


      // Build filter options for the current category
      this.buildFilterOptions();

      // Apply filters and setup infinite scroll
      this.applyFilters();
      this.setupInfiniteScroll();

    });

  }

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) {}

  getPrice(p: any) {
    return Math.round(p.price - (p.price * p.discount / 100));
  }

  
getFinalPrice(p: any) {
  return Math.round(p.price - (p.price * p.discount / 100));
}

// Multiply products N times
multiplyProducts(products: any[], times: number): any[] {
  let result: any[] = [];

  for (let i = 0; i < times; i++) {
    const cloned = products.map((p, index) => ({
      ...p,
      uniqueId: `${p.name}-${i}-${index}` // important for tracking
    }));

    result = result.concat(cloned);
  }

  return result;
}

addToCart(product: any) {
  const discountedPrice = this.getFinalPrice(product);
  const unitPrice = Number.isFinite(discountedPrice)
    ? discountedPrice
    : product.price;

  this.cartService.addToCart(
    {
      ...product,
      price: unitPrice
    },
    1
  );

  this.router.navigate(['/cart']);
}

getCompareKey(product: any): string {
  return product?._id || product?.id || product?.name || '';
}

isCompared(product: any): boolean {
  const key = this.getCompareKey(product);
  return this.compareKeySet.has(key);
}

toggleCompare(product: any, event: Event) {
  const input = event.target as HTMLInputElement;
  const key = this.getCompareKey(product);

  if (input.checked) {
    if (this.compareList.length >= 2) {
      input.checked = false;
      this.compareError = 'You can compare only two products.';
      return;
    }

    this.compareList = [...this.compareList, product];
    this.compareKeySet = new Set(this.compareKeySet).add(key);
    this.compareError = '';
    if (this.compareList.length === 2) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
    return;
  }

  this.compareList = this.compareList.filter(
    item => this.getCompareKey(item) !== key
  );
  const updatedKeys = new Set(this.compareKeySet);
  updatedKeys.delete(key);
  this.compareKeySet = updatedKeys;
  this.compareError = '';
}

removeCompare(product: any) {
  const key = this.getCompareKey(product);
  this.compareList = this.compareList.filter(
    item => this.getCompareKey(item) !== key
  );
  const updatedKeys = new Set(this.compareKeySet);
  updatedKeys.delete(key);
  this.compareKeySet = updatedKeys;
}

clearCompare() {
  this.compareList = [];
  this.compareKeySet = new Set<string>();
  this.compareError = '';
}

formatSpecs(product: any): string {
  const specs = product?.specifications || product?.features || [];
  if (Array.isArray(specs) && specs.length > 0) {
    return specs.join(', ');
  }

  return '—';
}

  trackByProduct(index: number, product: any): string {
    return product?.uniqueId || product?._id || product?.id || product?.name || String(index);
  }

// Extract unique brands from current category products
extractBrands() {
  const brands = this.products
    .map(p => p.brand)
    .filter((brand, index, self) => brand && self.indexOf(brand) === index);
  this.allBrands = brands.sort();
  this.availableBrands = this.allBrands;
}

buildFilterOptions() {
  this.extractBrands();

  this.availablePriceRanges = this.priceRangeOptions;

  this.availableRatings = this.ratingOptions.filter(rating =>
    this.products.some(p => (p.rating || 0) >= rating)
  );

  this.filters.priceRanges = this.filters.priceRanges.filter(range =>
    this.availablePriceRanges.some(option => option.id === range)
  );
  this.filters.brands = this.filters.brands.filter(brand => this.availableBrands.includes(brand));
  this.filters.ratings = this.filters.ratings.filter(rating => this.availableRatings.includes(rating));
}

isPriceInRange(range: string, price: number): boolean {
  if (range === '0-500') return price >= 0 && price <= 500;
  if (range === '500-1000') return price > 500 && price <= 1000;
  if (range === '1000-2000') return price > 1000 && price <= 2000;
  if (range === '2000-5000') return price > 2000 && price <= 5000;
  if (range === '5000-10000') return price > 5000 && price <= 10000;
  if (range === '10000-20000') return price > 10000 && price <= 20000;
  if (range === '20000-50000') return price > 20000 && price <= 50000;
  if (range === '50000-100000') return price > 50000 && price <= 100000;
  if (range === '100000-500000') return price > 100000 && price <= 500000;
  return false;
}

getRatingLabel(rating: number): string {
  return Array(rating).fill('⭐').join('');
}

// Setup infinite scroll listener
setupInfiniteScroll() {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 300;

    if (scrollPosition >= threshold && !this.isLoading && this.hasMoreProducts()) {
      this.loadMoreProducts();
    }
  });
}

// Load initial products
loadInitialProducts() {
  this.currentPage = 1;
  this.displayedProducts = this.filteredProducts.slice(0, this.itemsPerPage);
}

// Load more products for infinite scroll
loadMoreProducts() {
  this.isLoading = true;

  setTimeout(() => {
    this.currentPage++;
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.isLoading = false;
  }, 500);
}

// Check if there are more products to load
hasMoreProducts(): boolean {
  return this.displayedProducts.length < this.filteredProducts.length;
}

// Apply all active filters
applyFilters() {
  let filtered = [...this.products];

  // Filter by price ranges
  if (this.filters.priceRanges.length > 0) {
    filtered = filtered.filter(p => {
      const price = this.getFinalPrice(p);
      return this.filters.priceRanges.some(range => this.isPriceInRange(range, price));
    });
  }

  // Filter by brands
  if (this.filters.brands.length > 0) {
    filtered = filtered.filter(p => this.filters.brands.includes(p.brand));
  }

  // Filter by ratings
  if (this.filters.ratings.length > 0) {
    const minRating = Math.min(...this.filters.ratings);
    filtered = filtered.filter(p => p.rating >= minRating);
  }

  // Sort
  if (this.filters.sort === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (this.filters.sort === 'low') {
    filtered.sort((a, b) => this.getFinalPrice(a) - this.getFinalPrice(b));
  } else if (this.filters.sort === 'high') {
    filtered.sort((a, b) => this.getFinalPrice(b) - this.getFinalPrice(a));
  }

  this.filteredProducts = filtered;
  this.loadInitialProducts();
}

// Clear all filters
clearFilters() {
  this.filters = {
    sort: '',
    priceRanges: [],
    brands: [],
    ratings: []
  };
  this.applyFilters();
}

// Handle sort change
onSortChange(event: any) {
  this.filters.sort = event.target.value;
  this.applyFilters();
}

// Handle price range change
onPriceRangeChange(event: any, range: string) {
  if (event.target.checked) {
    this.filters.priceRanges.push(range);
  } else {
    this.filters.priceRanges = this.filters.priceRanges.filter(r => r !== range);
  }
  this.applyFilters();
}

// Handle brand change
onBrandChange(event: any, brand: string) {
  if (event.target.checked) {
    this.filters.brands.push(brand);
  } else {
    this.filters.brands = this.filters.brands.filter(b => b !== brand);
  }
  this.applyFilters();
}

// Handle rating change
onRatingChange(event: any, rating: number) {
  if (event.target.checked) {
    this.filters.ratings.push(rating);
  } else {
    this.filters.ratings = this.filters.ratings.filter(r => r !== rating);
  }
  this.applyFilters();
}


}
