import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { Product, InsertProduct, Order, InsertOrder } from '@shared/schema';
import type { IStorage } from './storage';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  // In development, use application default credentials or emulator
  initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore();

export class FirestoreStorage implements IStorage {
  private productsCollection = db.collection('products');
  private ordersCollection = db.collection('orders');

  // Products
  async getAllProducts(): Promise<Product[]> {
    const snapshot = await this.productsCollection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Product));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const doc = await this.productsCollection.doc(id).get();
    if (!doc.exists) return undefined;
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate() || new Date(),
    } as Product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const docRef = this.productsCollection.doc();
    const product: Product = {
      ...insertProduct,
      id: docRef.id,
      createdAt: new Date(),
    };
    await docRef.set({
      ...insertProduct,
      createdAt: new Date(),
    });
    return product;
  }

  async updateProduct(id: string, insertProduct: InsertProduct): Promise<Product | undefined> {
    const docRef = this.productsCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;

    await docRef.update(insertProduct);
    
    return {
      ...insertProduct,
      id,
      createdAt: doc.data()?.createdAt?.toDate() || new Date(),
    };
  }

  async deleteProduct(id: string): Promise<boolean> {
    const docRef = this.productsCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    
    await docRef.delete();
    return true;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    const snapshot = await this.ordersCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Order));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const doc = await this.ordersCollection.doc(id).get();
    if (!doc.exists) return undefined;
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate() || new Date(),
    } as Order;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const docRef = this.ordersCollection.doc();
    const order: Order = {
      ...insertOrder,
      id: docRef.id,
      status: 'pending',
      createdAt: new Date(),
    };
    await docRef.set({
      ...insertOrder,
      status: 'pending',
      createdAt: new Date(),
    });
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const docRef = this.ordersCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;

    await docRef.update({ status });
    
    const updated = await docRef.get();
    return {
      id: updated.id,
      ...updated.data(),
      createdAt: updated.data()?.createdAt?.toDate() || new Date(),
    } as Order;
  }
}

export const firestoreStorage = new FirestoreStorage();
