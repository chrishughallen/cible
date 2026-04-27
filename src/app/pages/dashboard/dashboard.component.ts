import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  article: any;
  loading = true;

  constructor(private articleService: ArticleService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.article = await this.articleService.getTodayArticle();
      this.loading = false;
    } catch (err) {
      console.error('Error loading article:', err);
    }
  }
}
