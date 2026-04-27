// Check if today’s article exists
// If yes → return it
// If no → generate once
// Save it
// Return it

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

export class ArticleService {
  constructor(
    private supabase: SupabaseService,
    private auth: AuthService
  ) {}

  async getTodayArticle() {
    const user = await this.auth.getUser();

    if (!user) {
      throw new Error('No user logged in');
    }

    const today = new Date().toISOString().split('T')[0];

    // 1. Check if article already exists
    const { data: existing, error } = await this.supabase.supabase
      .from('articles')
      .select('*')
      .eq('user_id', user.id)
      .eq('generated_for_date', today)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    if (!existing) {
      console.log('No article found → generating...');
    }

    // 2. If not, generate new one (TEMP stub)
    const newArticle = await this.generateArticle(user.id, today);

    return newArticle;
  }

  private async generateArticle(userId: string, date: string) {
    // TEMP: stub before OpenAI integration
    const mockArticle = {
      user_id: userId,
      generated_for_date: date,
      title: 'Mock: Understanding System Design Basics',
      topic: 'System Design',
      summary: 'This is a placeholder article.',
      case_study: 'Example case study here.',
      takeaway: 'Always think in scalable systems.',
    };

    const { data, error } = await this.supabase.supabase
      .from('articles')
      .insert(mockArticle)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }
}
