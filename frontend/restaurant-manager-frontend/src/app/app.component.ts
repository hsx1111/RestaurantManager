import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthService } from './health.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  protected readonly title = signal('Restaurant Manager');
  protected readonly statutApi = signal('Vérification en cours...');

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.healthService.getHealth().subscribe({
      next: (message) => this.statutApi.set(message),
      error: () => this.statutApi.set('API injoignable')
    });
  }
}
