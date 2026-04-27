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

  private async callEdgeFunction(topic: string) {
    const res = await fetch(
      'http://127.0.0.1:54321/functions/v1/generate-article',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      }
    );

    return await res.json();
  }

  private async generateArticle(userId: string, date: string) {
    const profile = await this.auth.getUserProfile();

    const topics = profile.topics || [];

    if (topics.length === 0) {
      throw new Error('No topics found. Please add topics first.');
    }

    const randomIndex = Math.floor(Math.random() * topics.length);
    const selectedTopic = topics[randomIndex];

    const response = await fetch(
      'http://127.0.0.1:54321/functions/v1/generate-article',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
        }),
      }
    );

    const generatedArticle = await response.json();

    const articleToSave = {
      user_id: userId,
      generated_for_date: date,
      topic: selectedTopic,
      title: generatedArticle.title,
      summary: generatedArticle.summary,
      case_study: generatedArticle.case_study,
      takeaway: generatedArticle.takeaway,
      source_prompt: generatedArticle.source_prompt,
    };

    const { data, error } = await this.supabase.supabase
      .from('articles')
      .insert(articleToSave)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }
}
