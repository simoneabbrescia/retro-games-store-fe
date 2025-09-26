import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrelloComponent } from '@features/carrello';
import { ContattiComponent } from '@features/contatti';
import { AccediComponent, RegistratiComponent } from '@features/credenziale';
import { FaqComponent } from '@features/faq';
import { HomeComponent } from '@features/home';
import { authGuard } from './auth/auth.guard';
import { CheckoutComponent } from './features/ordine/components/checkout/checkout.component';
import { DettaglioProdottoComponent } from './features/prodotto/components/dettaglio-prodotto/dettaglio-prodotto.component';
import { TerminiComponent } from './features/termini/termini.component';

const routes: Routes = [
  {
    path: '',
    title: 'RetroGames Store',
    component: HomeComponent,
  },
  {
    path: 'home',
    title: 'RetroGames Store',
    component: HomeComponent,
  },
  {
    path: 'faq',
    title: 'FAQ',
    component: FaqComponent,
  },
  {
    path: 'contatti',
    title: 'Contatti',
    component: ContattiComponent,
  },
  {
    path: 'accedi',
    title: 'Accedi',
    component: AccediComponent,
  },
  {
    path: 'registrati',
    title: 'Registrati',
    component: RegistratiComponent,
  },
  {
    path: 'prodotti/:id',
    component: DettaglioProdottoComponent,
  },
  {
    path: 'carrello',
    title: 'Carrello',
    component: CarrelloComponent,
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    title: 'Checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'termini',
    title: 'Termini',
    component: TerminiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
