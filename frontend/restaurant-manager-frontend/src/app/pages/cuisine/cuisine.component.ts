import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CuisineService } from '../../services/cuisine.service';
import { LigneTicket, TicketCuisine } from '../../models/ticket.model';

interface TicketAffiche extends TicketCuisine {
  minutes: number;
  enRetard: boolean;
  toutesPretes: boolean;
}

@Component({
  selector: 'app-cuisine',
  standalone: true,
  template: `
    <section class="page">
      <h1>Cuisine — Tickets en cours</h1>

      @if (ticketsAffiches().length === 0) {
        <p class="vide">Aucun ticket en cours.</p>
      } @else {
        <div class="grille">
          @for (ticket of ticketsAffiches(); track ticket.idCommande) {
            <div class="ticket" [class.retard]="ticket.enRetard">
              <div class="ticket-entete">
                <span class="table">Table {{ ticket.numeroTable }}</span>
                <span class="chrono" [class.rouge]="ticket.enRetard">{{ ticket.minutes }} min</span>
              </div>
              <div class="meta">
                <span>{{ ticket.nomServeur }}</span>
                <span>Envoyé à {{ formatHeure(ticket.dateEnvoi) }}</span>
              </div>

              <ul class="lignes">
                @for (ligne of ticket.lignes; track ligne.idDetail) {
                  <li [class.preparee]="ligne.prepare">
                    <label>
                      <input
                        type="checkbox"
                        [checked]="ligne.prepare"
                        [disabled]="ligne.prepare"
                        (change)="marquerLigne(ticket, ligne)"
                      />
                      <span class="qte">{{ ligne.quantite }}×</span>
                      <span class="nom">{{ ligne.nomPlat }}</span>
                    </label>
                  </li>
                }
              </ul>

              <button type="button" class="pret" [disabled]="!ticket.toutesPretes" (click)="marquerPret(ticket)">
                Ticket prêt
              </button>
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .page h1 { margin-top: 0; }
      .vide { color: var(--gris); }
      .grille {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1rem;
      }
      .ticket {
        background: var(--blanc);
        border: 1px solid var(--gris-clair);
        border-top: 5px solid var(--bleu);
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
      }
      .ticket.retard { border-top-color: var(--rouge); }
      .ticket-entete {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.35rem;
      }
      .table { font-weight: 700; font-size: 1.1rem; }
      .chrono {
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--gris-fonce);
      }
      .chrono.rouge { color: var(--rouge); }
      .meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--gris);
        margin-bottom: 0.75rem;
      }
      .lignes { list-style: none; margin: 0 0 1rem; padding: 0; }
      .lignes li { padding: 0.3rem 0; border-bottom: 1px solid var(--gris-clair); }
      .lignes li.preparee .nom { text-decoration: line-through; color: var(--gris); }
      .lignes label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
      .lignes input { width: 18px; height: 18px; }
      .qte { font-weight: 700; }
      .pret {
        margin-top: auto;
        padding: 0.6rem;
        border: none;
        border-radius: 8px;
        background: var(--vert);
        color: var(--blanc);
        font-weight: 600;
        cursor: pointer;
      }
      .pret:disabled { background: var(--gris); cursor: default; }
    `
  ]
})
export class CuisineComponent implements OnInit, OnDestroy {
  private readonly cuisineService = inject(CuisineService);

  readonly tickets = signal<TicketCuisine[]>([]);
  private readonly maintenant = signal(Date.now());

  private timerRefresh?: ReturnType<typeof setInterval>;
  private timerHorloge?: ReturnType<typeof setInterval>;

  readonly ticketsAffiches = computed<TicketAffiche[]>(() => {
    const now = this.maintenant();
    return this.tickets().map((ticket) => {
      const minutes = Math.max(0, Math.floor((now - new Date(ticket.dateEnvoi).getTime()) / 60000));
      return {
        ...ticket,
        minutes,
        enRetard: minutes > 15,
        toutesPretes: ticket.lignes.length > 0 && ticket.lignes.every((ligne) => ligne.prepare)
      };
    });
  });

  ngOnInit(): void {
    this.refresh();
    this.timerRefresh = setInterval(() => this.refresh(), 5000);
    this.timerHorloge = setInterval(() => this.maintenant.set(Date.now()), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerRefresh);
    clearInterval(this.timerHorloge);
  }

  private refresh(): void {
    this.cuisineService.getTickets().subscribe({
      next: (liste) => this.tickets.set(liste)
    });
  }

  marquerLigne(ticket: TicketCuisine, ligne: LigneTicket): void {
    if (ligne.prepare) {
      return;
    }
    this.cuisineService.marquerLignePrete(ligne.idDetail).subscribe({
      next: () => {
        this.tickets.update((tickets) =>
          tickets.map((t) =>
            t.idCommande === ticket.idCommande
              ? {
                  ...t,
                  lignes: t.lignes.map((l) => (l.idDetail === ligne.idDetail ? { ...l, prepare: true } : l))
                }
              : t
          )
        );
      }
    });
  }

  marquerPret(ticket: TicketCuisine): void {
    this.cuisineService.marquerCommandeServie(ticket.idCommande).subscribe({
      next: () => this.refresh()
    });
  }

  formatHeure(dateEnvoi: string): string {
    return new Date(dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
