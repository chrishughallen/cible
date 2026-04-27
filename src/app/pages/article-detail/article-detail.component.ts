import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss'
})
export class ArticleDetailComponent {
  article: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.article = await this.articlesService.getArticleById(id);

    this.loading = false;
  }
}
