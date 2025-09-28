import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authAdminGuard, authGuard } from '@core/guards';
import { DashboardComponent } from '@features/admin';
import { AdminComponent } from '@features/admin/components/admin/admin.component';
import { CarrelloComponent } from '@features/carrello';
import { ContattiComponent } from '@features/contatti';
import { AccediComponent, RegistratiComponent } from '@features/credenziale';
import { FaqComponent } from '@features/faq';
import { HomeComponent } from '@features/home';
import { CheckoutComponent } from '@features/ordine';
import { DettaglioProdottoComponent } from '@features/prodotto';
import { ProfiloCredenzialiComponent } from '@features/profilo/components/profilo-credenziali/profilo-credenziali.component';
import { ProfiloEliminaAccountComponent } from '@features/profilo/components/profilo-elimina-account/profilo-elimina-account.component';
import { ProfiloInformazioniPersonaliComponent } from '@features/profilo/components/profilo-informazioni-personali/profilo-informazioni-personali.component';
import { ProfiloMetodoPagamentoComponent } from '@features/profilo/components/profilo-metodo-pagamento/profilo-metodo-pagamento.component';
import { ProfiloStoricoOrdiniComponent } from '@features/profilo/components/profilo-storico-ordini/profilo-storico-ordini.component';
import { ProfiloComponent } from '@features/profilo/components/profilo/profilo.component';
import { TerminiComponent } from '@features/termini/termini.component';

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
  {
    path: 'admin',
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
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'informazioni-personali' },
      { path: 'informazioni-personali', component: ProfiloInformazioniPersonaliComponent },
      { path: 'credenziali', component: ProfiloCredenzialiComponent },
      { path: 'metodo-pagamento', component: ProfiloMetodoPagamentoComponent },
      { path: 'storico-ordini', component: ProfiloStoricoOrdiniComponent },
      { path: 'elimina-account', component: ProfiloEliminaAccountComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
