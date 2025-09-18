import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pagine/home/home.component';
import { FaqComponent } from './pagine/faq/faq.component';
import { ContattiComponent } from './pagine/contatti/contatti.component';
import { AccediComponent } from './pagine/accedi/accedi.component';
import { RegistratiComponent } from './pagine/registrati/registrati.component';

const routes: Routes = [
  {
    path: '',
    title: 'Home Page',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
