import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './componenti/footer/footer.component';
import { HeaderComponent } from './componenti/header/header.component';
import { ShoppingInfoComponent } from './componenti/shopping-info/shopping-info.component';
import { AccediComponent } from './pagine/accedi/accedi.component';
import { ContattiComponent } from './pagine/contatti/contatti.component';
import { FaqComponent } from './pagine/faq/faq.component';
import { HomeComponent } from './pagine/home/home.component';
import { RegistratiComponent } from './pagine/registrati/registrati.component';
import { MaterialModule } from './shared/material.module';
import { DettaglioProdottoComponent } from './pagine/dettaglio-prodotto/dettaglio-prodotto.component';
import { CarrelloComponent } from './pagine/carrello/carrello.component';
import { CheckoutComponent } from './pagine/checkout/checkout.component';

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
    CheckoutComponent
  ],
  imports: [BrowserModule, AppRoutingModule, MaterialModule],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
