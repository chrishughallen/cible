import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss'
})
export class TopicsComponent {
  newTopic = '';
  topics: string[] = [];
  loading = true;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const profile = await this.authService.getUserProfile();

    this.topics = profile.topics || [];
    this.loading = false;
  }

  async addTopic() {
    if (!this.newTopic.trim()) return;

    this.topics.push(this.newTopic.trim());

    await this.authService.updateTopics(this.topics);

    this.newTopic = '';
  }
}
