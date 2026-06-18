import { Component, input, output } from '@angular/core';

type CouleurPastille = 'rouge' | 'bleu' | 'orange' | 'vert';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
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
