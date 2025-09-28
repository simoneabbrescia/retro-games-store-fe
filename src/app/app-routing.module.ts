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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
