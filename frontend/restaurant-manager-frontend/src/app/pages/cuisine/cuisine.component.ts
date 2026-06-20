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
  templateUrl: './cuisine.component.html',
  styleUrl: './cuisine.component.css'
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
      next: (liste) => this.tickets.set(liste),
      error: () => {
        // Erreur transitoire de polling : on garde les derniers tickets connus.
      }
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
