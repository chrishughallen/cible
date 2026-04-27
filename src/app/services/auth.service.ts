import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    this.initAuthListener();
  }

  private async initAuthListener() {
    const { data } = await this.supabase.supabase.auth.getSession();
    this.userSubject.next(data.session?.user ?? null);

    this.supabase.supabase.auth.onAuthStateChange((_event, session) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.getUser();
    return !!user;
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

  async getUserProfile() {
    const { data: sessionData } = await this.supabase.supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) return null;

    const { data, error } = await this.supabase.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Profile error:', error);
      return null;
    }

    return data;
  }

  async updateTopics(topics: string[]) {
    const user = await this.getUser();

    if (!user) {
      throw new Error('No user logged in');
    }

    const { data, error } = await this.supabase.supabase
      .from('users')
      .update({ topics })
      .eq('id', user.id)
      .select();

    if (error) {
      throw error;
    }
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
      throw error;
    }
  }
}
