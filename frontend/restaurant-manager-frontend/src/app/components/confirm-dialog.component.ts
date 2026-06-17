import { Component, input, output } from '@angular/core';

type CouleurPastille = 'rouge' | 'bleu' | 'orange' | 'vert';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="overlay" (click)="annuler.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>{{ titre() }}</h3>
        <p class="message">{{ message() }}</p>
        <div class="actions">
          <button type="button" class="btn-secondaire" (click)="annuler.emit()">Annuler</button>
          <button type="button" class="btn-confirmer" [style.background]="couleurCss()" (click)="confirmer.emit()">
            {{ libelleConfirmer() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      h3 {
        margin: 0 0 0.75rem;
      }
      .message {
        margin: 0 0 1.5rem;
        color: var(--gris-fonce);
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
      button {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        border: 1px solid var(--gris-clair);
      }
      .btn-secondaire {
        background: var(--blanc);
        color: var(--noir);
      }
      .btn-confirmer {
        border: none;
        color: var(--blanc);
        font-weight: 600;
      }
    `
  ]
})
export class ConfirmDialogComponent {
  readonly titre = input('Confirmation');
  readonly message = input('');
  readonly libelleConfirmer = input('Confirmer');
  readonly couleur = input<CouleurPastille>('rouge');

  readonly confirmer = output<void>();
  readonly annuler = output<void>();

  couleurCss(): string {
    return `var(--${this.couleur()})`;
  }
}
