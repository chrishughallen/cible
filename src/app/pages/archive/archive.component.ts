import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesService } from '../../services/articles.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit {
  articles: any[] = [];
  loading = true;

  constructor(private articlesService: ArticlesService) {}

  async ngOnInit() {
    this.loading = true;
    this.articles = await this.articlesService.getUserArticles();
    this.loading = false;
  }
}
