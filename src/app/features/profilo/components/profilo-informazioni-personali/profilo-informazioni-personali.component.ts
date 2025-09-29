import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountDTO } from '@features/account/data-access/dtos/account-response.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountApiService, AccountReq, AccountService } from '@features/account';
import { ResponseObject } from '@core/types';

@Component({
  selector: 'app-profilo-informazioni-personali',
  standalone: false,
  templateUrl: './profilo-informazioni-personali.component.html',
  styleUrls: ['./profilo-informazioni-personali.component.css'],
})
export class ProfiloInformazioniPersonaliComponent implements OnInit {
  public account?: AccountDTO;
  public isEditing = false;
  public infoForm!: FormGroup;

  constructor(
    private accountApiService: AccountApiService,
    private accountService: AccountService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.fetchAccount();
    this.setReadOnly(true);
  }

  private fetchAccount(): void {
    this.accountApiService
      .getById(this.accountService.getAccountId())
      .subscribe({
        next: (res: ResponseObject<AccountDTO>) => {
          if (!res.returnCode) {
            console.error(
              "[Checkout] Errore nel recupero dell'account:",
              res.msg
            );
            return;
          }
          this.account = res.dati;
          this.populateFormFromAccount();
        },
        error: (err) =>
          console.error("[Checkout] Errore nel recupero dell'account:", err),
      });
  }

  private loadForm() {
    this.infoForm = this.fb.group({
      nome: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      cognome: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      via: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      citta: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      cap: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.pattern('^[0-9]{5}$'),
      ]),
      paese: this.fb.nonNullable.control('Italia', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
    });
  }

  private populateFormFromAccount(): void {
    if (!this.account) return;
    this.infoForm.patchValue({
      nome: this.account.nome ?? '',
      cognome: this.account.cognome ?? '',
      via: this.account.indirizzo?.via ?? '',
      citta: this.account.indirizzo?.citta ?? '',
      cap: this.account.indirizzo?.cap ?? '',
      paese: this.account.indirizzo?.paese ?? '',
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  setReadOnly(readonly: boolean) {
    this.isEditing = !readonly;
    if (readonly) {
      this.infoForm.disable({ emitEvent: false }); // blocca interazione
    } else {
      this.infoForm.enable({ emitEvent: false });
    }
  }

  onEdit() {
    this.setReadOnly(false);
  }

  onCancel() {
    this.populateFormFromAccount();
    this.setReadOnly(true);
  }

  onSave() {
    if (this.infoForm.invalid) return;
    this.setReadOnly(true);
    const body: AccountReq = {
      id: this.account?.id,
      nome: this.infoForm.value.nome,
      cognome: this.infoForm.value.cognome,
      indirizzo: {
        via: this.infoForm.value.via,
        citta: this.infoForm.value.citta,
        cap: this.infoForm.value.cap,
        paese: this.infoForm.value.paese,
      }
    }
    this.accountApiService.update(body).subscribe({
      next: (res) => {
        if (!res.returnCode) {
          console.error("[Profilo] Errore nell'aggiornamento dell'account:", res.msg);
          return;
        }
        this.fetchAccount();
        this.snackbar.open("Informazioni salvate con successo", "Chiudi", { duration: 5000, panelClass: ['snackbar-success'] });
      },
      error: (err) =>
        console.error("[Profilo] Errore nell'aggiornamento dell'account:", err),
    });
  }

}
