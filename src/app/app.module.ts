import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FooterComponent,
  HeaderComponent,
  ShoppingInfoComponent,
} from '@core/layout';
import { MaterialModule } from '@core/material';
import { AccountComponent } from '@features/account';
import { DashboardComponent } from '@features/admin';
import { CarrelloComponent } from '@features/carrello';
import { ContattiComponent } from '@features/contatti';
import { AccediComponent, RegistratiComponent } from '@features/credenziale';
import { FaqComponent } from '@features/faq';
import { HomeComponent } from '@features/home';
import { CheckoutComponent } from '@features/ordine';
import { DettaglioProdottoComponent } from '@features/prodotto';
import { TerminiComponent } from '@features/termini/components/termini.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './features/admin/components/admin/admin.component';
import { ProfiloInformazioniPersonaliComponent } from './features/profilo/components/profilo-informazioni-personali/profilo-informazioni-personali.component';
import { ProfiloMetodoPagamentoComponent } from './features/profilo/components/profilo-metodo-pagamento/profilo-metodo-pagamento.component';
import { ProfiloStoricoOrdiniComponent } from './features/profilo/components/profilo-storico-ordini/profilo-storico-ordini.component';
import { ProfiloComponent } from './features/profilo/components/profilo/profilo.component';
import { ProfiloCredenzialiComponent } from './features/profilo/components/profilo-credenziali/profilo-credenziali.component';
import { ConfirmDialogComponent } from '@core/layout/confirm-dialog/confirm-dialog.component';
import { NonAutorizzatoComponent } from './features/non-autorizzato/non-autorizzato.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ShoppingInfoComponent,
    FaqComponent,
    ContattiComponent,
    AccediComponent,
    RegistratiComponent,
    DettaglioProdottoComponent,
    CarrelloComponent,
    CheckoutComponent,
    TerminiComponent,
    AccountComponent,
    DashboardComponent,
    AdminComponent,
    ProfiloComponent,
    ProfiloInformazioniPersonaliComponent,
    ProfiloMetodoPagamentoComponent,
    ProfiloStoricoOrdiniComponent,
    ProfiloCredenzialiComponent,
    ConfirmDialogComponent,
    NonAutorizzatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
