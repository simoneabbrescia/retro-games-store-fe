import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ConfirmDialogComponent,
  FooterComponent,
  HeaderComponent,
  ShoppingInfoComponent,
} from '@core/layout';
import { MaterialModule } from '@core/material';
import { AccountComponent } from '@features/account';
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
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    AdminComponent,
    DashboardComponent,
    ProfiloComponent,
    ProfiloInformazioniPersonaliComponent,
    ProfiloMetodoPagamentoComponent,
    ProfiloStoricoOrdiniComponent,
    ProfiloCredenzialiComponent,
    ConfirmDialogComponent,
    NonAutorizzatoComponent,
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
