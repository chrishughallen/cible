import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = new BehaviorSubject<any>(null);

  constructor(private supabase: SupabaseService) {
    this.init();
  }

  async init() {
    const { data } = await this.supabase.supabase.auth.getSession();
    this.user$.next(data.session?.user ?? null);

    this.supabase.supabase.auth.onAuthStateChange((_event, session) => {
      this.user$.next(session?.user ?? null);
    });
  }

  async getUser() {
    const { data, error } =
      await this.supabase.supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data.user;
  }

  signUp(email: string, password: string) {
    return this.supabase.supabase.auth.signUp({ email, password });
  }

  signIn(email: string, password: string) {
    return this.supabase.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    const { error } = await this.supabase.supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}
