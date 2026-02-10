import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-home',   // ✅ THIS LINE FIXES EVERYTHING
  standalone: true,
  imports: [CommonModule,RouterModule],
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


  // ================= LIFE CYCLE =================

ngOnInit() {
  this.loadKitchen();

  this.startAutoSlide();
  this.loadPhones();
  this.loadElectronics();
  this.loadFashion();
  this.loadTv();
  this.loadHome();
  this.loadBooks();
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
      name: 'Non-Stick Cookware Set',
      price: 3499,
      discount: 40,
      image: 'https://m.media-amazon.com/images/I/81+vY7fZsFL._SX679_.jpg'
    },

    {
      name: 'Mixer Grinder',
      price: 4999,
      discount: 30,
      image: 'https://m.media-amazon.com/images/I/71Zf9uUp+GL._SX679_.jpg'
    },

    {
      name: 'Air Fryer',
      price: 8999,
      discount: 35,
      image: 'https://m.media-amazon.com/images/I/71qKzqk6YFL._SX679_.jpg'
    },

    {
      name: 'Steel Dinner Set',
      price: 2999,
      discount: 25,
      image: 'https://m.media-amazon.com/images/I/71kZcZk0nZL._SX679_.jpg'
    },

    {
      name: 'Electric Kettle',
      price: 1999,
      discount: 20,
      image: 'https://m.media-amazon.com/images/I/61s7y3JzLKL._SX679_.jpg'
    }

  ];

  this.infiniteKitchen = [
    ...this.kitchen,
    ...this.kitchen,
    ...this.kitchen
  ];

  setTimeout(() => {
    this.kitchenContainer.nativeElement.scrollLeft =
      this.kitchenContainer.nativeElement.scrollWidth / 3;
  }, 0);
}


loadBooks() {

  this.books = [

    {
      name: 'Atomic Habits',
      price: 599,
      discount: 40,
      image: 'https://m.media-amazon.com/images/I/91bYsX41DVL.jpg'
    },

    {
      name: 'Rich Dad Poor Dad',
      price: 499,
      discount: 35,
      image: 'https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg'
    },

    {
      name: 'The Psychology of Money',
      price: 699,
      discount: 30,
      image: 'https://m.media-amazon.com/images/I/71g2ednj0JL.jpg'
    },

    {
      name: 'Ikigai',
      price: 399,
      discount: 25,
      image: 'https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg'
    },

    {
      name: 'Think Like a Monk',
      price: 499,
      discount: 20,
      image: 'https://m.media-amazon.com/images/I/71b1cZV5jKL.jpg'
    }

  ];

  this.infiniteBooks = [
    ...this.books,
    ...this.books,
    ...this.books
  ];

  setTimeout(() => {
    this.booksContainer.nativeElement.scrollLeft =
      this.booksContainer.nativeElement.scrollWidth / 3;
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
      name: 'Wooden Sofa Set',
      price: 45999,
      discount: 25,
      image: 'https://m.media-amazon.com/images/I/81Jzv5KJ7WL._SX679_.jpg'
    },

    {
      name: 'King Size Bed',
      price: 38999,
      discount: 20,
      image: 'https://m.media-amazon.com/images/I/81pZ7C8F6PL._SX679_.jpg'
    },

    {
      name: 'Study Table',
      price: 8999,
      discount: 30,
      image: 'https://m.media-amazon.com/images/I/71kQ9+KJZEL._SX679_.jpg'
    },

    {
      name: 'Office Chair',
      price: 12999,
      discount: 35,
      image: 'https://m.media-amazon.com/images/I/71QqT7M2pKL._SX679_.jpg'
    },

    {
      name: 'Bookshelf Rack',
      price: 6999,
      discount: 15,
      image: 'https://m.media-amazon.com/images/I/71aQpKJx+BL._SX679_.jpg'
    }

  ];

  this.infiniteHome = [
    ...this.home,
    ...this.home,
    ...this.home
  ];

  setTimeout(() => {
    this.homeContainer.nativeElement.scrollLeft =
      this.homeContainer.nativeElement.scrollWidth / 3;
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
      name: 'Samsung 55" Smart TV',
      price: 58999,
      discount: 22,
      image: 'https://m.media-amazon.com/images/I/71S8U9VzLTL._SX679_.jpg'
    },

    {
      name: 'LG Washing Machine',
      price: 32999,
      discount: 18,
      image: 'https://m.media-amazon.com/images/I/71+K9h5C5WL._SX679_.jpg'
    },

    {
      name: 'Voltas Split AC',
      price: 39999,
      discount: 25,
      image: 'https://m.media-amazon.com/images/I/61C3zZJtGWL._SX679_.jpg'
    },

    {
      name: 'Whirlpool Refrigerator',
      price: 28999,
      discount: 20,
      image: 'https://m.media-amazon.com/images/I/71Zf9uUp+GL._SX679_.jpg'
    },

    {
      name: 'Mi 43" Android TV',
      price: 26999,
      discount: 15,
      image: 'https://m.media-amazon.com/images/I/71cYtZb8wDL._SX679_.jpg'
    }

  ];

  this.infiniteTv = [
    ...this.tv,
    ...this.tv,
    ...this.tv
  ];

  setTimeout(() => {
    this.tvContainer.nativeElement.scrollLeft =
      this.tvContainer.nativeElement.scrollWidth / 3;
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
      name: 'Dell Laptop',
      price: 65999,
      discount: 15,
      image: 'https://m.media-amazon.com/images/I/61fDHkQ6MqL._SX679_.jpg'
    },

    {
      name: 'Sony Headphones',
      price: 19999,
      discount: 20,
      image: 'https://m.media-amazon.com/images/I/61CGHv6kmWL._SX679_.jpg'
    },

    {
      name: 'Canon Camera',
      price: 55999,
      discount: 10,
      image: 'https://m.media-amazon.com/images/I/71EWRyqzw0L._SX679_.jpg'
    },

    {
      name: 'JBL Speaker',
      price: 7999,
      discount: 25,
      image: 'https://m.media-amazon.com/images/I/61J9B4p8YkL._SX679_.jpg'
    },

    {
      name: 'Samsung Monitor',
      price: 17999,
      discount: 18,
      image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._SX679_.jpg'
    }

  ];

  this.infiniteElectronics = [
    ...this.electronics,
    ...this.electronics,
    ...this.electronics
  ];

  setTimeout(() => {
    if (this.electronicsContainer) {
      const container = this.electronicsContainer.nativeElement;
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, 0);
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
loadFashion() {

  this.fashion = [

    {
      name: 'Men Casual Shirt',
      price: 1999,
      discount: 30,
      image: 'https://m.media-amazon.com/images/I/71T3K9ZB7WL._UY879_.jpg'
    },

    {
      name: 'Women Kurti',
      price: 2499,
      discount: 35,
      image: 'https://m.media-amazon.com/images/I/71G0C5GvMQL._UY879_.jpg'
    },

    {
      name: 'Men Jeans',
      price: 2999,
      discount: 25,
      image: 'https://m.media-amazon.com/images/I/71F8d1kZ6ML._UY879_.jpg'
    },

    {
      name: 'Women Handbag',
      price: 3499,
      discount: 40,
      image: 'https://m.media-amazon.com/images/I/61V+4WRoE3L._UY879_.jpg'
    },

    {
      name: 'Running Shoes',
      price: 3999,
      discount: 20,
      image: 'https://m.media-amazon.com/images/I/71p1C7P6lWL._UY879_.jpg'
    }

  ];

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
