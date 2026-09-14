import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'phone_store_cart';
  private items$ = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());

  cart$ = this.items$.asObservable();

  private getCartFromStorage(): CartItem[] {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.items$.next(items);
  }

  addToCart(item: CartItem): void {
    const currentItems = this.getCartFromStorage();
    const index = currentItems.findIndex(x => x.variantId === item.variantId);

    if (index > -1) {
      currentItems[index].quantity += item.quantity;
    } else {
      currentItems.push(item);
    }
    this.saveCart(currentItems);
  }

  updateQuantity(variantId: string, quantity: number): void {
    let currentItems = this.getCartFromStorage();
    if (quantity <= 0) {
      currentItems = currentItems.filter(x => x.variantId !== variantId);
    } else {
      const item = currentItems.find(x => x.variantId === variantId);
      if (item) item.quantity = quantity;
    }
    this.saveCart(currentItems);
  }

  removeFromCart(variantId: string): void {
    const currentItems = this.getCartFromStorage().filter(x => x.variantId !== variantId);
    this.saveCart(currentItems);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotalPrice(): number {
    return this.getCartFromStorage().reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
