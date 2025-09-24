import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccediComponent } from './pagine/accedi/accedi.component';
import { CarrelloComponent } from './pagine/carrello/carrello.component';
import { CheckoutComponent } from './pagine/checkout/checkout.component';
import { ContattiComponent } from './pagine/contatti/contatti.component';
import { DettaglioProdottoComponent } from './pagine/dettaglio-prodotto/dettaglio-prodotto.component';
import { FaqComponent } from './pagine/faq/faq.component';
import { HomeComponent } from './pagine/home/home.component';
import { RegistratiComponent } from './pagine/registrati/registrati.component';

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
  },
  {
    path: 'checkout',
    title: 'Checkout',
    component: CheckoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
