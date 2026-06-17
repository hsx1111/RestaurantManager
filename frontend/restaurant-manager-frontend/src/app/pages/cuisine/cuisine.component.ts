import { Component } from '@angular/core';

@Component({
  selector: 'app-cuisine',
  standalone: true,
  template: `
    <section class="page">
      <h1>Cuisine</h1>
      <p>Module à venir (Cuisine).</p>
    </section>
  `,
  styles: [`.page h1 { margin-top: 0; }`]
})
export class CuisineComponent {}
