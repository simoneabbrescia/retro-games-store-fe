import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-non-autorizzato',
  standalone: false,
  templateUrl: './non-autorizzato.component.html',
  styleUrl: './non-autorizzato.component.css',
})
export class NonAutorizzatoComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginLink = computed(() => ['/accedi']);

  retry(): void {
    location.reload();
  }

  back(): void {
    if (history.length > 1) history.back();
    else this.router.navigateByUrl('/home');
  }
}
