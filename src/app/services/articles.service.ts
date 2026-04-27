import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

export class ArticlesService {
  constructor(
    private supabase: SupabaseService,
    private auth: AuthService
  ) {}

  async getUserArticles() {
    const user = await this.auth.getUser();

    if (!user) {
      throw new Error('No user logged in');
    }

    const { data, error } = await this.supabase.supabase
      .from('articles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      throw error;
    }

    return data ?? []; // 🔥 CRITICAL FIX
  }

  async getArticleById(id: string) {
    const { data, error } = await this.supabase.supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }
}
