import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {

  category = '';
  products: any[] = [];

  // ✅ ALL PRODUCTS MOVED FROM HOME
  allProducts: any = {

    mobiles: [
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
    ],

    electronics: [
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
    ],

    fashion: [
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
    ],

    tv: [
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
    ],

    home: [
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
    ],

    books: [
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
    ],

    kitchen: [
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
    ]

  };

  ngOnInit() {

    this.route.params.subscribe(params => {

      this.category = params['category'];

      this.products =
        this.allProducts[this.category] || [];

    });

  }

  constructor(private route: ActivatedRoute) {}

  getPrice(p: any) {
    return Math.round(p.price - (p.price * p.discount / 100));
  }

  
getFinalPrice(p: any) {
  return Math.round(p.price - (p.price * p.discount / 100));
}


addToCart(product: any) {

  let cart: any[] = [];

  const storedCart = localStorage.getItem('cart');

  if (storedCart) {
    cart = JSON.parse(storedCart);
  }

  const existing = cart.find(
    item => item.name === product.name
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      ...product,
      qty: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

}


}
