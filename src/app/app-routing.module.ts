import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { alreadyAuthGuard, authAdminGuard, authGuard } from '@core/guards';
import { AdminComponent, DashboardComponent } from '@features/admin';
import { CarrelloComponent } from '@features/carrello';
import { ContattiComponent } from '@features/contatti';
import { AccediComponent, RegistratiComponent } from '@features/credenziale';
import { FaqComponent } from '@features/faq';
import { HomeComponent } from '@features/home';
import { NonAutorizzatoComponent } from '@features/non-autorizzato';
import { CheckoutComponent } from '@features/ordine';
import { DettaglioProdottoComponent } from '@features/prodotto';
import {
  ProfiloComponent,
  ProfiloCredenzialiComponent,
  ProfiloInformazioniPersonaliComponent,
  ProfiloMetodoPagamentoComponent,
  ProfiloStoricoOrdiniComponent,
} from '@features/profilo';
import { TerminiComponent } from '@features/termini';

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
    canActivate: [alreadyAuthGuard],
  },
  {
    path: 'registrati',
    title: 'Registrati',
    component: RegistratiComponent,
    canActivate: [alreadyAuthGuard],
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
  {
    path: 'admin',
    title: 'Admin',
    component: AdminComponent,
    canActivate: [authAdminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      // Altre sottorotte admin qui
      // { path: 'gestione-account', component: GestioneAccountComponent },
      // { path: 'categoria', component: CategoriaComponent },
    ],
  },
  {
    path: 'profilo',
    component: ProfiloComponent,
    canActivate: [authGuard],
    title: 'Profilo',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'informazioni-personali' },
      {
        path: 'informazioni-personali',
        component: ProfiloInformazioniPersonaliComponent,
      },
      { path: 'credenziali', component: ProfiloCredenzialiComponent },
      { path: 'metodo-pagamento', component: ProfiloMetodoPagamentoComponent },
      { path: 'storico-ordini', component: ProfiloStoricoOrdiniComponent },
    ],
  },
  {
    path: '401',
    title: 'Non Autorizzato',
    component: NonAutorizzatoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
