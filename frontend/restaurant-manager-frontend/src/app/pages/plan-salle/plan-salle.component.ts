import { Component } from '@angular/core';

@Component({
  selector: 'app-plan-salle',
  standalone: true,
  template: `
    <section class="page">
      <h1>Plan de salle</h1>
      <p>Module à venir (Serveur).</p>
    </section>
  `,
  styles: [`.page h1 { margin-top: 0; }`]
})
export class PlanSalleComponent {}
