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
  showFilters = false;
    // Toggle filter panel for mobile
    toggleFilters() {
      this.showFilters = !this.showFilters;
    }
    closeFilters() {
      this.showFilters = false;
    }
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

  homePageCatalog: Record<string, Array<{ name: string; price: number; discount: number; image: string }>> = {
    mobiles: [
      { name: 'Samsung Galaxy S25 Ultra', price: 74999, discount: 10, image: 'assets/Mobiles/Samsung Galaxy S25 Ultra.jpg' },
      { name: 'iPhone 17 Pro Max', price: 159999, discount: 12, image: 'assets/Mobiles/Iphone 17 pro max.jpg' },
      { name: 'OnePlus Nord 5', price: 49999, discount: 15, image: 'assets/Mobiles/Oneplus Nord 5.jpg' },
      { name: 'iPhone 15', price: 69999, discount: 5, image: 'assets/Mobiles/Iphone 15.jpg' },
      { name: 'OnePlus 11', price: 56999, discount: 12, image: 'assets/Mobiles/Oneplus 11.jpg' },
      { name: 'Google Pixel 10', price: 109999, discount: 18, image: 'assets/Mobiles/Google Pixel 10.jpg' },
      { name: 'Vivo V27', price: 32999, discount: 8, image: 'assets/Mobiles/Vivo V27.jpg' },
      { name: 'Redmi Note 12', price: 15999, discount: 20, image: 'assets/Mobiles/Redmi Note 12.jpg' }
    ],
    electronics: [
      { name: 'Dell Inspiron 15', price: 65999, discount: 15, image: 'assets/Electronics/Dell Inspiron.avif' },
      { name: 'Dell Vostro 5620', price: 55999, discount: 10, image: 'assets/Electronics/Dell Vostro 1.avif' },
      { name: 'HP Pavilion x360', price: 19999, discount: 20, image: 'assets/Electronics/HP Pavilion.avif' },
      { name: 'Asus ROG Strix G635', price: 55999, discount: 10, image: 'assets/Electronics/Asus Rog.avif' },
      { name: 'Apple MacBook Air M2', price: 119999, discount: 10, image: 'assets/Electronics/Apple Macbook.avif' },
      { name: 'Dell Alienware 16X', price: 55999, discount: 10, image: 'assets/Electronics/Dell Alien.avif' },
      { name: 'HP Victus 15', price: 45999, discount: 15, image: 'assets/Electronics/HP Victus.avif' },
      { name: 'Acer Aspire 7', price: 49999, discount: 10, image: 'assets/Electronics/Acer Aspire.avif' }
    ],
    fashion: [
      { name: 'Snitch Slim Fit Shirt', price: 1999, discount: 30, image: 'assets/Fashion/Snitch shirt.avif' },
      { name: 'H&M Floral Print Dress', price: 2499, discount: 35, image: 'assets/Fashion/H&M Floral.avif' },
      { name: 'Adidas T-Shirt', price: 2999, discount: 25, image: 'assets/Fashion/Adidas T-Shirt.avif' },
      { name: 'Puma Hoodie', price: 3499, discount: 40, image: 'assets/Fashion/Puma Hoodie.avif' },
      { name: 'Adidas Sneakers', price: 3999, discount: 20, image: 'assets/Fashion/Adidas Sneakers.avif' },
      { name: 'Swiss Military Hanowa', price: 2899, discount: 22, image: 'assets/Fashion/Swiss Military.avif' },
      { name: 'Armani Exchange Shirt', price: 2199, discount: 26, image: 'assets/Fashion/Armani Exchange.avif' },
      { name: 'Puma Backpack', price: 3299, discount: 24, image: 'assets/Fashion/Puma Backpack.avif' }
    ],
    tv: [
      { name: 'LG Smart TV', price: 58999, discount: 22, image: 'assets/TV/LG TV.avif' },
      { name: 'Sony Bravia 8 II OLED TV', price: 32999, discount: 18, image: 'assets/TV/Sony TV.avif' },
      { name: 'Samsung Crystal 4K TV', price: 39999, discount: 25, image: 'assets/TV/Samsung TV.avif' },
      { name: 'Xiaomi 4K Smart TV', price: 28999, discount: 20, image: 'assets/TV/Xiaomi TV.avif' },
      { name: 'Motorola UHD Smart TV', price: 26999, discount: 15, image: 'assets/TV/Moto TV.avif' },
      { name: 'Toshiba C350 4K TV', price: 18999, discount: 20, image: 'assets/TV/Toshiba TV.avif' },
      { name: 'Xiaomi X Series TV', price: 13999, discount: 17, image: 'assets/TV/Xiaomi TV 2.avif' },
      { name: 'Acer M Series Smart TV', price: 64999, discount: 19, image: 'assets/TV/Acer TV.avif' }
    ],
    home: [
      { name: 'Brimnes Day Bed Frame', price: 45999, discount: 25, image: 'assets/Home/Bed.avif' },
      { name: 'Mossjoen Wall Cabinet', price: 38999, discount: 20, image: 'assets/Home/Wall Cabinet.avif' },
      { name: 'Variera Shelf Insert', price: 8999, discount: 30, image: 'assets/Home/Variera Shelf Insert.avif' },
      { name: 'Brimnes Wardrobe', price: 12999, discount: 35, image: 'assets/Home/Brimnes Wardrobe.avif' },
      { name: 'Loshult Trolley', price: 6999, discount: 15, image: 'assets/Home/Trolley.avif' },
      { name: 'Billy TV Storage Combination', price: 7999, discount: 18, image: 'assets/Home/Billy TV.avif' },
      { name: 'Akterspring Table Lamp', price: 24999, discount: 22, image: 'assets/Home/Table lamp.avif' },
      { name: 'Ytberg LED Cabinet Lighting', price: 4999, discount: 16, image: 'assets/Home/LED Cabin Light.avif' }
    ],
    books: [
      { name: 'Atomic Habits', price: 599, discount: 40, image: 'assets/Books/Atomic Habits.jpg' },
      { name: 'Rich Dad Poor Dad', price: 499, discount: 35, image: 'assets/Books/Rich Dad Poor Dad.jpg' },
      { name: 'The Psychology of Money', price: 699, discount: 30, image: 'assets/Books/The Psychology of Money.jpg' },
      { name: 'Ikigai', price: 399, discount: 25, image: 'assets/Books/Ikigai.jpg' },
      { name: 'Think Like a Monk', price: 499, discount: 20, image: 'assets/Books/Think like a Monk.jpg' },
      { name: 'Deep Work', price: 549, discount: 18, image: 'assets/Books/Deep Work.webp' },
      { name: 'The Monk Who Sold His Ferrari', price: 549, discount: 18, image: 'assets/Books/The Monk Who Sold His Ferrari.jpg' },
      { name: 'The Alchemist', price: 399, discount: 25, image: 'assets/Books/The Alchemist.jpg' }
    ],
    kitchen: [
      { name: 'Kent Aqua RO Purifier', price: 3499, discount: 40, image: 'assets/Kitchen/Kent Aqua.jpg' },
      { name: 'Crompton Arno Neo 15-L Geyser', price: 4999, discount: 30, image: 'assets/Kitchen/Geyser.jpg' },
      { name: 'Bajaj DX-6 1000 Watts Dry Iron', price: 8999, discount: 35, image: 'assets/Kitchen/Iron.jpg' },
      { name: 'Prestige 1.5L Stainless Steel Electric Kettle', price: 2999, discount: 25, image: 'assets/Kitchen/Kettle.jpg' },
      { name: 'Bajaj ATX 4 Pop-up Toaster', price: 1999, discount: 20, image: 'assets/Kitchen/Toaster.jpg' },
      { name: 'Havells High Speed Ceiling Fan', price: 1499, discount: 28, image: 'assets/Kitchen/Fan.jpg' },
      { name: 'Philips HL7756 Mixer Grinder', price: 2799, discount: 22, image: 'assets/Kitchen/Mixer.jpg' },
      { name: 'KENT Storm Vacuum Cleaner', price: 1699, discount: 18, image: 'assets/Kitchen/Vaccum.jpg' }
    ]
  };

  // ✅ ALL PRODUCTS MOVED FROM HOME
  allProducts: any = {

    mobiles: [
      {
        name: 'Samsung Galaxy S23',
        brand: 'Samsung',
        price: 74999,
        discount: 10,
        image: 'assets/Mobiles/Samsung Galaxy S25 Ultra.jpg',
        specifications: ['6.8" Dynamic AMOLED Display', 'Snapdragon 8 Gen 2 Processor', '50MP Triple Camera Setup', '5000mAh Battery with Fast Charging'],
        rating: 4.6,
        reviewsCount: 2847
      },
      {
        name: 'iPhone 17 Pro Max',
        brand: 'Apple',
        price: 159999,
        discount: 12,
        image: 'assets/Mobiles/Iphone 17 pro max.jpg',
        specifications: ['6.7" ProMotion OLED Display', 'A18 Pro Chip with 8GB RAM', '48MP Pro Camera System with 8K Video', 'Titanium Frame with Ceramic Shield'],
        rating: 4.8,
        reviewsCount: 5621
      },
      {
        name: 'OnePlus Nord 5',
        brand: 'OnePlus',
        price: 49999,
        discount: 15,
        image: 'assets/Mobiles/Oneplus Nord 5.jpg',
        specifications: ['6.5" 120Hz AMOLED Display', 'MediaTek Dimensity 9000', '64MP Triple Camera', '4500mAh with 80W SuperVOOC Charging'],
        rating: 4.4,
        reviewsCount: 1523
      },
      {
        name: 'iPhone 15',
        brand: 'Apple',
        price: 69999,
        discount: 5,
        image: 'assets/Mobiles/Iphone 15.jpg',
        specifications: ['6.1" Super Retina XDR Display', 'A16 Bionic Chip', '48MP Main + 12MP Ultra Wide Camera', 'USB-C Port with MagSafe Support'],
        rating: 4.7,
        reviewsCount: 4392
      },
      {
        name: 'OnePlus 11',
        brand: 'OnePlus',
        price: 56999,
        discount: 12,
        image: 'assets/Mobiles/Oneplus 11.jpg',
        specifications: ['6.7" QHD+ 120Hz AMOLED', 'Snapdragon 8 Gen 2', '50MP Hasselblad Camera System', '5000mAh with 100W SuperVOOC'],
        rating: 4.5,
        reviewsCount: 2156
      },
      {
        name: 'Redmi Note 12',
        brand: 'Redmi',
        price: 15999,
        discount: 20,
        image: 'assets/Mobiles/Redmi Note 12.jpg',
        specifications: ['6.67" FHD+ 120Hz Display', 'Snapdragon 685 Processor', '48MP Triple Camera', '5000mAh with 33W Fast Charging'],
        rating: 4.3,
        reviewsCount: 8734
      },
      {
        name: 'Vivo V27',
        brand: 'Vivo',
        price: 32999,
        discount: 8,
        image: 'assets/Mobiles/Vivo V27.jpg',
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
        image: 'assets/Electronics/Dell Inspiron.avif',
        specifications: ['15.6" FHD Anti-Glare Display', 'Intel Core i5 12th Gen', '8GB RAM, 512GB SSD', 'Windows 11, 6 Hour Battery Life'],
        rating: 4.4,
        reviewsCount: 1245
      },
      {
        name: 'Sony Headphones',
        brand: 'Sony',
        price: 19999,
        discount: 20,
        image: 'assets/Electronics/HP Pavilion.avif',
        specifications: ['Active Noise Cancellation', 'Bluetooth 5.2 with LDAC Support', '30 Hour Battery Life', 'Premium Comfortable Over-Ear Design'],
        rating: 4.7,
        reviewsCount: 3562
      },
      {
        name: 'Canon Camera',
        brand: 'Canon',
        price: 55999,
        discount: 10,
        image: 'assets/Electronics/Acer Aspire.avif',
        specifications: ['24.1MP APS-C CMOS Sensor', 'DIGIC 8 Image Processor', '45-Point All Cross-Type AF System', 'Full HD 1080p Video Recording'],
        rating: 4.6,
        reviewsCount: 987
      },
      {
        name: 'JBL Speaker',
        brand: 'JBL',
        price: 7999,
        discount: 25,
        image: 'assets/Electronics/Asus Rog.avif',
        specifications: ['Bluetooth 5.1 Connectivity', 'IPX7 Waterproof Rating', '12 Hours Playtime', 'PartyBoost for Speaker Pairing'],
        rating: 4.5,
        reviewsCount: 4521
      },
      {
        name: 'Samsung Monitor',
        brand: 'Samsung',
        price: 17999,
        discount: 18,
        image: 'assets/Electronics/Apple Macbook.avif',
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
        image: 'assets/Fashion/Snitch shirt.avif',
        specifications: ['100% Premium Cotton Fabric', 'Slim Fit Design', 'Wrinkle-Resistant Material', 'Size: S, M, L, XL, XXL Available'],
        rating: 4.1,
        reviewsCount: 6782
      },
      {
        name: 'Women Kurti',
        brand: 'Libas',
        price: 2499,
        discount: 35,
        image: 'assets/Fashion/H&M Floral.avif',
        specifications: ['Rayon Blend Fabric', 'A-Line Pattern with Embroidery', 'Machine Washable', 'Sizes: XS, S, M, L, XL, XXL'],
        rating: 4.4,
        reviewsCount: 5421
      },
      {
        name: 'Men Jeans',
        brand: 'Levis',
        price: 2999,
        discount: 25,
        image: 'assets/Fashion/Armani Exchange.avif',
        specifications: ['Stretchable Denim Fabric', 'Regular Fit Design', 'Mid Rise with 5 Pockets', 'Waist: 28-42 inches Available'],
        rating: 4.2,
        reviewsCount: 4932
      },
      {
        name: 'Women Handbag',
        brand: 'Baggit',
        price: 3499,
        discount: 40,
        image: 'assets/Fashion/Puma Backpack.avif',
        specifications: ['Premium Vegan Leather Material', 'Multiple Compartments with Zipper', 'Adjustable Shoulder Strap', 'Dimensions: 35cm x 28cm x 12cm'],
        rating: 4.3,
        reviewsCount: 3298
      },
      {
        name: 'Running Shoes',
        brand: 'Adidas',
        price: 3999,
        discount: 20,
        image: 'assets/Fashion/Adidas Sneakers.avif',
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
        image: 'assets/TV/Samsung TV.avif',
        specifications: ['55" Crystal 4K UHD Display', 'Smart Hub with Streaming Apps', '3 HDMI & 2 USB Ports', '20W Dolby Digital Plus Audio'],
        rating: 4.6,
        reviewsCount: 3456
      },
      {
        name: 'LG Washing Machine',
        brand: 'LG',
        price: 32999,
        discount: 18,
        image: 'assets/TV/LG TV.avif',
        specifications: ['7.5 kg Fully Automatic', 'AI Direct Drive Technology', '6 Motion DD & Smart Diagnosis', '5 Star Energy Rating'],
        rating: 4.4,
        reviewsCount: 2187
      },
      {
        name: 'Voltas Split AC',
        brand: 'Voltas',
        price: 39999,
        discount: 25,
        image: 'assets/TV/Acer TV.avif',
        specifications: ['1.5 Ton Inverter Split AC', '5 Star Energy Rating', 'Copper Condenser, Turbo Mode', 'Smart Wi-Fi Control with App'],
        rating: 4.3,
        reviewsCount: 1654
      },
      {
        name: 'Whirlpool Refrigerator',
        brand: 'Whirlpool',
        price: 28999,
        discount: 20,
        image: 'assets/TV/Toshiba TV.avif',
        specifications: ['265L Double Door Refrigerator', 'Intellisense Inverter Technology', '3 Star Energy Rating', 'Convertible Freezer Mode'],
        rating: 4.2,
        reviewsCount: 2891
      },
      {
        name: 'Mi 43" Android TV',
        brand: 'Mi',
        price: 26999,
        discount: 15,
        image: 'assets/TV/Xiaomi TV.avif',
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
        image: 'assets/Home/Bed.avif',
        specifications: ['3+2 Seater Sheesham Wood', 'High-Density Foam Cushions', 'Fabric/Leatherette Upholstery', 'Dimensions: 180cm x 85cm x 90cm'],
        rating: 4.5,
        reviewsCount: 876
      },
      {
        name: 'King Size Bed',
        brand: 'Wakefit',
        price: 38999,
        discount: 20,
        image: 'assets/Home/Brimnes Wardrobe.avif',
        specifications: ['King Size: 183cm x 203cm', 'Engineered Wood Frame', 'Cushioned Headboard', 'Box Storage Option Available'],
        rating: 4.3,
        reviewsCount: 1234
      },
      {
        name: 'Study Table',
        brand: 'Nilkamal',
        price: 8999,
        discount: 30,
        image: 'assets/Home/Variera Shelf Insert.avif',
        specifications: ['Particle Board with Laminate Finish', '2 Drawers + Open Shelf', 'Cable Management System', 'Dimensions: 120cm x 60cm x 75cm'],
        rating: 4.1,
        reviewsCount: 2567
      },
      {
        name: 'Office Chair',
        brand: 'Green Soul',
        price: 12999,
        discount: 35,
        image: 'assets/Home/Table lamp.avif',
        specifications: ['Ergonomic Design with Lumbar Support', 'Height Adjustable: 45-53cm', 'Mesh Back, PU Leather Seat', '360° Swivel with Smooth Casters'],
        rating: 4.4,
        reviewsCount: 3421
      },
      {
        name: 'Bookshelf Rack',
        brand: 'Amazon Brand',
        price: 6999,
        discount: 15,
        image: 'assets/Home/Billy TV.avif',
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
        image: 'assets/Books/Atomic Habits.jpg',
        specifications: ['Author: James Clear', 'Paperback - 320 Pages', 'Publisher: Penguin Random House', 'Language: English ISBN: 9780735211292'],
        rating: 4.8,
        reviewsCount: 12453
      },
      {
        name: 'Rich Dad Poor Dad',
        brand: 'Plata',
        price: 499,
        discount: 35,
        image: 'assets/Books/Rich Dad Poor Dad.jpg',
        specifications: ['Author: Robert T. Kiyosaki', 'Paperback - 336 Pages', 'Publisher: Plata Publishing', 'Language: English'],
        rating: 4.7,
        reviewsCount: 18762
      },
      {
        name: 'The Psychology of Money',
        brand: 'Harriman House',
        price: 699,
        discount: 30,
        image: 'assets/Books/The Psychology of Money.jpg',
        specifications: ['Author: Morgan Housel', 'Paperback - 256 Pages', 'Publisher: Harriman House', 'Language: English'],
        rating: 4.6,
        reviewsCount: 9823
      },
      {
        name: 'Ikigai',
        brand: 'Penguin',
        price: 399,
        discount: 25,
        image: 'assets/Books/Ikigai.jpg',
        specifications: ['Authors: Héctor García & Francesc Miralles', 'Paperback - 208 Pages', 'Publisher: Penguin Books', 'Language: English'],
        rating: 4.5,
        reviewsCount: 7654
      },
      {
        name: 'Think Like a Monk',
        brand: 'Simon & Schuster',
        price: 499,
        discount: 20,
        image: 'assets/Books/Think like a Monk.jpg',
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
        image: 'assets/Kitchen/Kent Aqua.jpg',
        specifications: ['7-Piece Set (3 Pans, 3 Lids, 1 Kadai)', 'Non-Stick Coating, Induction Safe', 'Aluminum Body with Bakelite Handle', 'Dishwasher Safe, 2 Year Warranty'],
        rating: 4.3,
        reviewsCount: 5432
      },
      {
        name: 'Mixer Grinder',
        brand: 'Philips',
        price: 4999,
        discount: 30,
        image: 'assets/Kitchen/Mixer.jpg',
        specifications: ['750W Powerful Motor', '3 Stainless Steel Jars (0.4L, 1L, 1.5L)', 'Overload Protection', '2 Year Warranty on Motor'],
        rating: 4.4,
        reviewsCount: 3876
      },
      {
        name: 'Air Fryer',
        brand: 'Philips',
        price: 8999,
        discount: 35,
        image: 'assets/Kitchen/Fan.jpg',
        specifications: ['4.5L Large Capacity', '1400W Rapid Air Technology', 'Digital Touch Controls with 8 Presets', 'Temperature Range: 80-200°C'],
        rating: 4.5,
        reviewsCount: 6892
      },
      {
        name: 'Steel Dinner Set',
        brand: 'Milton',
        price: 2999,
        discount: 25,
        image: 'assets/Kitchen/Iron.jpg',
        specifications: ['24-Piece Set (6 Each: Plates, Bowls, Glasses, Spoons)', 'Food Grade Stainless Steel', 'Mirror Finish, Rust Resistant', 'Dishwasher Safe'],
        rating: 4.2,
        reviewsCount: 4321
      },
      {
        name: 'Electric Kettle',
        brand: 'Prestige',
        price: 1999,
        discount: 20,
        image: 'assets/Kitchen/Kettle.jpg',
        specifications: ['1.8L Capacity, 1500W Power', 'Stainless Steel Body', 'Auto Shut-off & Boil Dry Protection', '360° Swivel Base, Cordless Design'],
        rating: 4.3,
        reviewsCount: 7821
      }
    ]

  };

  ngOnInit() {

    this.route.params.subscribe(params => {

      this.category = params['category'];

      const originalProducts = this.getHomeSyncedProducts(this.category);
      this.products = this.multiplyProducts(originalProducts, 10);
      this.itemsPerPage = this.products.length;


      // Build filter options for the current category
      this.buildFilterOptions();

      // Apply filters and setup infinite scroll
      this.applyFilters();
      this.setupInfiniteScroll();

    });

  }

  private getHomeSyncedProducts(category: string): any[] {
    const homeProducts = this.homePageCatalog[category] || [];
    const existingProducts = this.allProducts[category] || [];

    return homeProducts.map((homeProduct, index) => {
      const matched = existingProducts.find((item: any) =>
        this.normalizeName(item?.name) === this.normalizeName(homeProduct.name)
      );

      const fallback = matched || existingProducts[index] || {};
      const specs = this.resolveSpecificationsFromName(homeProduct.name);

      return {
        ...fallback,
        name: homeProduct.name,
        price: homeProduct.price,
        discount: homeProduct.discount,
        image: homeProduct.image,
        brand: fallback.brand || this.resolveBrandFromName(homeProduct.name),
        rating: fallback.rating ?? 4.3,
        reviewsCount: fallback.reviewsCount ?? 1000,
        specifications: specs.length > 0
          ? specs
          : (fallback.specifications || ['Best quality product'])
      };
    });
  }

  private resolveSpecificationsFromName(productName: string): string[] {
    const value = this.normalizeName(productName);

    const specificationMap: Record<string, string[]> = {
      'samsung galaxy s25 ultra': ['6.8" QHD+ Dynamic AMOLED 2X Display', 'Snapdragon 8 Elite Processor', '200MP Quad Camera with 5x Zoom', '5000mAh Battery with 45W Fast Charging'],
      'iphone 17 pro max': ['6.9" ProMotion OLED Display', 'A19 Pro Chip', '48MP Pro Triple Camera System', 'Titanium Body with Advanced Ceramic Shield'],
      'oneplus nord 5': ['6.74" 120Hz AMOLED Display', 'Snapdragon 7+ Series Chipset', '50MP OIS Main Camera', '5000mAh Battery with 80W Charging'],
      'iphone 15': ['6.1" Super Retina XDR OLED', 'A16 Bionic Chip', '48MP Main + 12MP Ultra-Wide Camera', 'USB-C with MagSafe Support'],
      'oneplus 11': ['6.7" 120Hz QHD+ AMOLED Display', 'Snapdragon 8 Gen 2 Processor', '50MP Hasselblad Triple Camera', '5000mAh Battery with 100W SUPERVOOC'],
      'google pixel 10': ['6.7" LTPO OLED Display', 'Google Tensor G5 Processor', '50MP AI Camera with Pro Controls', 'All-day Battery with Fast Wireless Charging'],
      'vivo v27': ['6.78" FHD+ AMOLED 120Hz Display', 'MediaTek Dimensity 7200', '50MP OIS Rear Camera + 50MP Selfie', '4600mAh Battery with 66W FlashCharge'],
      'redmi note 12': ['6.67" FHD+ AMOLED 120Hz Display', 'Snapdragon 685 Processor', '50MP Triple Rear Camera', '5000mAh Battery with 33W Fast Charging'],

      'dell inspiron 15': ['15.6" Full HD Anti-Glare Display', 'Intel Core i5 Processor', '16GB RAM with 512GB SSD', 'Backlit Keyboard with Windows 11'],
      'dell vostro 5620': ['16" FHD+ Display', 'Intel Core i5 12th Gen Processor', '8GB RAM with 512GB SSD', 'Business-grade Security Features'],
      'hp pavilion x360': ['14" Touchscreen Convertible Display', 'Intel Core i3/i5 Processor', '360° Hinge for Tablet Mode', 'Fast Charge with Bang & Olufsen Audio'],
      'asus rog strix g635': ['16" High Refresh Rate Gaming Display', 'Intel Core i7 Processor', 'NVIDIA GeForce RTX Graphics', 'Advanced Cooling with RGB Keyboard'],
      'apple macbook air m2': ['13.6" Liquid Retina Display', 'Apple M2 Chip', '8GB Unified Memory with SSD Storage', 'Fanless Design with All-day Battery'],
      'dell alienware 16x': ['16" QHD+ 240Hz Gaming Display', 'Intel Core i9 Processor', 'NVIDIA GeForce RTX Laptop GPU', 'Alienware Cryo-tech Cooling System'],
      'hp victus 15': ['15.6" FHD 144Hz Display', 'AMD Ryzen/Intel Core Gaming CPU', 'NVIDIA GeForce Graphics', 'Dual-fan Cooling with OMEN Gaming Hub'],
      'acer aspire 7': ['15.6" Full HD IPS Display', 'AMD Ryzen 5 / Intel Core i5 Processor', 'NVIDIA GTX/RTX Dedicated Graphics', '512GB SSD with Backlit Keyboard'],

      'snitch slim fit shirt': ['Slim Fit Casual Shirt', 'Premium Cotton Blend Fabric', 'Spread Collar with Full Sleeves', 'Machine Wash Friendly'],
      'h&m floral print dress': ['Floral Printed Midi Dress', 'Soft Viscose Blend Material', 'Regular Fit with Flowy Silhouette', 'Ideal for Casual & Party Wear'],
      'adidas t-shirt': ['Regular Fit Sports T-Shirt', 'Breathable Cotton-Poly Blend', 'Classic Crew Neck Design', 'Moisture-managing Fabric'],
      'puma hoodie': ['Relaxed Fit Hoodie', 'Soft Fleece Inner Lining', 'Adjustable Drawstring Hood', 'Ribbed Cuffs and Hem'],
      'adidas sneakers': ['Lifestyle Sneakers with Cushioned Sole', 'Breathable Mesh Upper', 'Durable Rubber Outsole', 'Comfort Fit for Daily Use'],
      'swiss military hanowa': ['Premium Analog Watch', 'Stainless Steel Strap', 'Quartz Movement', 'Water-resistant Build'],
      'armani exchange shirt': ['Slim Fit Designer Shirt', 'Premium Cotton Fabric', 'Button-down Front with Spread Collar', 'Ideal for Smart Casual Styling'],
      'puma backpack': ['Spacious Multi-compartment Backpack', 'Padded Shoulder Straps', 'Durable Polyester Construction', 'Laptop-friendly Utility Design'],

      'lg smart tv': ['50" 4K UHD Smart LED Panel', 'webOS Smart Platform', 'HDR10 with AI Picture Enhancement', '20W Speakers with Multiple HDMI/USB Ports'],
      'sony bravia 8 ii oled tv': ['65" 4K OLED Display', 'XR Processor with Deep Contrast', 'Google TV with Voice Assistant', 'Dolby Vision and Dolby Atmos Support'],
      'samsung crystal 4k tv': ['65" Crystal UHD 4K Panel', 'Crystal Processor 4K', 'Tizen Smart TV Experience', 'HDR Support with Slim Design'],
      'xiaomi 4k smart tv': ['55" 4K UHD Display', 'PatchWall with Android TV Features', 'Dolby Audio and DTS Support', 'Built-in Chromecast and Voice Remote'],
      'motorola uhd smart tv': ['65" UHD Smart Display', 'Android TV with Play Store', 'Dolby Vision + Dolby Atmos', 'MEMC Technology for Smooth Motion'],
      'toshiba c350 4k tv': ['55" 4K UHD Smart Display', 'VIDAA Smart OS', 'Regza Engine 4K Processing', 'Bezel-less Design with Voice Remote'],
      'xiaomi x series tv': ['55" 4K UHD Smart Panel', 'Android TV with Google Assistant', 'Vivid Picture Engine', '30W Speakers with Dolby Audio'],
      'acer m series smart tv': ['75" 4K Ultra HD Smart TV', 'Frameless Design with Wide Viewing Angle', 'Android TV with Chromecast Built-in', 'High-fidelity Speakers with Dolby Audio'],

      'brimnes day bed frame': ['Day Bed Frame with 2 Drawers', 'Convertible to Double Bed', 'Engineered Wood Construction', 'Space-saving Design for Guest Rooms'],
      'mossjoen wall cabinet': ['Wall Cabinet with Glass Door', 'Integrated Shelves for Display', 'Anthracite Finish', 'Ideal for Kitchen/Living Storage'],
      'variera shelf insert': ['Stackable Shelf Insert', 'Powder-coated Steel Frame', 'Optimizes Cabinet Vertical Space', 'Easy-clean Surface'],
      'brimnes wardrobe': ['3-door Wardrobe Unit', 'Adjustable Shelves and Hanging Rail', 'White Laminated Finish', 'Compact Bedroom Storage Solution'],
      'loshult trolley': ['Portable Storage Trolley', 'Solid Pine Construction', 'Multi-use Utility Shelves', 'Smooth-rolling Caster Wheels'],
      'billy tv storage combination': ['TV Storage Combination Unit', 'Open and Closed Shelving', 'Modular BILLY Series Compatibility', 'Ideal for Living Room Organization'],
      'akterspring table lamp': ['Decorative Table Lamp', 'Opal Glass Shade', 'Brass-plated Base', 'Soft Ambient Light for Bedside/Desk'],
      'ytberg led cabinet lighting': ['LED Cabinet Lighting Strip', 'Dimmable Brightness Control', 'Energy Efficient Illumination', 'Designed for Shelves and Cabinets'],

      'atomic habits': ['Author: James Clear', 'Format: Paperback', 'Genre: Self-help / Productivity', 'Focus: Habit Building & Behavioral Change'],
      'rich dad poor dad': ['Author: Robert T. Kiyosaki', 'Format: Paperback', 'Genre: Personal Finance', 'Focus: Wealth Mindset & Financial Literacy'],
      'the psychology of money': ['Author: Morgan Housel', 'Format: Paperback', 'Genre: Finance / Behavioral Economics', 'Focus: Money Habits & Decision Making'],
      'ikigai': ['Authors: Héctor García & Francesc Miralles', 'Format: Paperback', 'Genre: Lifestyle / Philosophy', 'Focus: Japanese Concept of Purposeful Living'],
      'think like a monk': ['Author: Jay Shetty', 'Format: Paperback', 'Genre: Self-growth', 'Focus: Mindfulness, Purpose, and Peace'],
      'deep work': ['Author: Cal Newport', 'Format: Paperback', 'Genre: Productivity', 'Focus: High-value Focused Work Strategies'],
      'the monk who sold his ferrari': ['Author: Robin Sharma', 'Format: Paperback', 'Genre: Inspirational Fiction', 'Focus: Life Balance & Spiritual Growth'],
      'the alchemist': ['Author: Paulo Coelho', 'Format: Paperback', 'Genre: Fiction / Adventure', 'Focus: Dreams, Destiny, and Personal Legend'],

      'kent aqua ro purifier': ['Multi-stage RO + UV + UF Purification', 'TDS Control with Mineral Retention', 'Storage Tank with Auto Shut-off', 'Suitable for Brackish/Tap Water'],
      'crompton arno neo 15-l geyser': ['15L Storage Water Heater', 'Powerful Heating Element', 'Anti-rust Tank Coating', 'Safety Valve with Thermal Cut-out'],
      'bajaj dx-6 1000 watts dry iron': ['1000W Dry Iron', 'Non-stick Soleplate', 'Adjustable Thermostat Control', 'Lightweight and Ergonomic Handle'],
      'prestige 1.5l stainless steel electric kettle': ['1.5L Capacity Electric Kettle', 'Stainless Steel Body', 'Auto Shut-off and Boil Dry Protection', '360° Swivel Cordless Base'],
      'bajaj atx 4 pop-up toaster': ['2-slice Pop-up Toaster', 'Variable Browning Control', 'Auto Pop-up with Reheat Option', 'Compact Cool-touch Body'],
      'havells high speed ceiling fan': ['High-speed Air Delivery Fan', 'Durable Copper Motor', 'Aerodynamically Balanced Blades', 'Energy Efficient Performance'],
      'philips hl7756 mixer grinder': ['750W Powerful Motor', '3 Stainless Steel Jars', 'Advanced Air Ventilation Design', 'Overload Protection for Safety'],
      'kent storm vacuum cleaner': ['High Suction Vacuum Cleaner', 'Multi-surface Cleaning Attachments', 'Compact Body with Easy Mobility', 'Reusable Dust Collection System']
    };

    return specificationMap[value] || [];
  }

  private normalizeName(name: string): string {
    return String(name || '').trim().toLowerCase();
  }

  private resolveBrandFromName(productName: string): string {
    const value = this.normalizeName(productName);

    if (value.includes('iphone') || value.includes('apple')) return 'Apple';
    if (value.includes('samsung')) return 'Samsung';
    if (value.includes('oneplus')) return 'OnePlus';
    if (value.includes('google') || value.includes('pixel')) return 'Google';
    if (value.includes('vivo')) return 'Vivo';
    if (value.includes('redmi')) return 'Redmi';
    if (value.includes('dell')) return 'Dell';
    if (value.includes('hp')) return 'HP';
    if (value.includes('asus')) return 'Asus';
    if (value.includes('acer')) return 'Acer';
    if (value.includes('snitch')) return 'Snitch';
    if (value.includes('h&m')) return 'H&M';
    if (value.includes('adidas')) return 'Adidas';
    if (value.includes('puma')) return 'Puma';
    if (value.includes('swiss military')) return 'Swiss Military';
    if (value.includes('armani')) return 'Armani Exchange';
    if (value.includes('lg')) return 'LG';
    if (value.includes('sony')) return 'Sony';
    if (value.includes('xiaomi')) return 'Xiaomi';
    if (value.includes('motorola')) return 'Motorola';
    if (value.includes('toshiba')) return 'Toshiba';
    if (value.includes('brimnes') || value.includes('mossjoen') || value.includes('variera') || value.includes('loshult') || value.includes('billy') || value.includes('akterspring') || value.includes('ytberg')) return 'IKEA';
    if (value.includes('kent')) return 'Kent';
    if (value.includes('crompton')) return 'Crompton';
    if (value.includes('bajaj')) return 'Bajaj';
    if (value.includes('prestige')) return 'Prestige';
    if (value.includes('havells')) return 'Havells';
    if (value.includes('philips')) return 'Philips';
    if (value.includes('atomic habits')) return 'Avery';
    if (value.includes('rich dad poor dad')) return 'Plata';
    if (value.includes('psychology of money') || value.includes('monk who sold his ferrari')) return 'Jaico';
    if (value.includes('ikigai')) return 'Westland';
    if (value.includes('think like a monk')) return 'HarperCollins';
    if (value.includes('deep work')) return 'Grand Central';
    if (value.includes('alchemist')) return 'HarperOne';

    return 'Generic';
  }

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) {}

  getPrice(p: any) {
    return Math.round(p.price - (p.price * p.discount / 100));
  }

  isLargeImageCategory(): boolean {
    return this.category === 'electronics';
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
  ).subscribe({
    next: () => this.router.navigate(['/cart']),
    error: () => {
      this.cartService.addToLocalCart(
        {
          ...product,
          price: unitPrice
        },
        1
      ).subscribe({
        next: () => this.router.navigate(['/cart'])
      });
    }
  });
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
