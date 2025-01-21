import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {_MatInternalFormField} from '@angular/material/core';
// Para la localización en español
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { AsyncPipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MAT_DATE_FORMATS } from '@angular/material/core';
// the `default as` syntax.
import moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { TypesServiceService } from '../../services/types-service.service';
import { EntitiesServiceService } from '../../services/entities-service.service';
import { ICheqType } from '../../interfaces/types.interface';
import { IEntity } from '../../interfaces/entity.interface';
import { map, Observable, of, startWith } from 'rxjs';

// Registrar la localización en español
registerLocaleData(localeEs);

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',  // Esto define cómo se parsea la fecha desde un texto
  },
  display: {
    dateInput: 'DD/MM/YYYY',   // Este es el formato en que se muestra la fecha en el input
    monthYearLabel: 'MMM YYYY',  // El formato de visualización en el DatePicker
    dateA11yLabel: 'LL',  // El formato de accesibilidad para la fecha
    monthYearA11yLabel: 'MMMM YYYY',  // Formato de accesibilidad para el año/mes
  },
};

interface IDialogData {
  title: string;
  cheqNumber?: string;
  issueDate?: Date;
  dueDate?: Date;
  stateId: number;
  bankBusinessUserId: number;
  createdAt? : Date;
}

@Component({
  selector: 'app-abm-cheq-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDatepickerModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  providers: [
    provideMomentDateAdapter(MY_DATE_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },  // Configura el idioma del Datepicker
    { provide: LOCALE_ID, useValue: 'es-ES' },         // Configura el idioma global de la aplicación
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './abm-cheq-dialog.component.html',
  styleUrl: './abm-cheq-dialog.component.css'
})
export class AbmCheqDialogComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AbmCheqDialogComponent>);

  readonly data = inject<IDialogData>(MAT_DIALOG_DATA);

  readonly typesSvc = inject(TypesServiceService);

  readonly entitiesSvc = inject(EntitiesServiceService);

  public cheqTypes! : ICheqType[];

  public filteredCheqTypes! : Observable<ICheqType[]>;

  public entities! : IEntity[];

  public filteredEntities! : Observable<IEntity[]>;

  ngOnInit(): void {
    this.typesSvc.getCheqTypes().subscribe({
      next: (types) => {
        this.cheqTypes = types;
        this._configureTypeListener();
      }
    });

    this.entitiesSvc.getEntities().subscribe({
      next: (entities) => {
        this.entities = entities;
        this._configureEntityListener();
      }
    });

  }

  private _configureEntityListener(){
    this.filteredEntities = this.cheqGroupControl.get("entityControl") ? 
    this.cheqGroupControl.get("entityControl")!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === "string" ? value : value?.entityName;
        return name ? this._filterEntity(name as string) : this.entities.slice();
      })
    ) : of([...this.entities])
  }

  private _configureTypeListener(){
    this.filteredCheqTypes = this.cheqGroupControl.get("cheqTypeControl")?
    this.cheqGroupControl.get("cheqTypeControl")!.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === "string" ? value : value?.typeName;
          return name ? this._filterType(name as string) : this.cheqTypes.slice();
        })
      ) : of([...this.cheqTypes])
  }

  private _filterEntity(name: string) : IEntity[] {
    const filterValue = name.toLowerCase();

    return this.entities.filter(entity => entity.entityName.toLowerCase().includes(filterValue));
  }

  private _filterType(name: string) : ICheqType[] {
    const filterValue = name.toLowerCase();

    return this.cheqTypes.filter(type => type.typeName.toLowerCase().includes(filterValue));
  }

  cheqGroupControl = new FormGroup({
    cheqNumberControl: new FormControl("", [Validators.required]),
    issueDateControl : new FormControl(moment(), [Validators.required]),
    dueDateControl: new FormControl("", [Validators.required]),
    entityControl : new FormControl<IEntity | string>("", [this.entityValidator]),
    cheqTypeControl : new FormControl<ICheqType | string>("", [this.typeValidator]),
    cheqAmountControl: new FormControl<number>(0, [Validators.required])
  });

  // Validador personalizado para asegurar que el valor es un IBusiness
  entityValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    // Verificamos si el valor es un objeto con la propiedad 'businessName'
    if (value && typeof value === 'object' && 'entityName' in value) {
      return null; // Validación exitosa
    }
    return { invalidEntity: true };  // Si no es un objeto IBusiness, retornamos un error
  }

  typeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    // Verificamos si el valor es un objeto con la propiedad 'businessName'
    if (value && typeof value === 'object' && 'typeName' in value) {
      return null; // Validación exitosa
    }
    return { invalidType: true };  // Si no es un objeto IBusiness, retornamos un error
  }

  cheqTypesDisplayFn(value: ICheqType){
    return value ? `${value.typeName}`:''
  }

  entitiesDisplayFn(value: IEntity){
    return value ? `${value.entityName}` : ""
  }

  onCloseDialog() : void{
    this.dialogRef.close(null);
  }

  onSubmit(){
    if(this.cheqGroupControl.valid){
      this.dialogRef.close({
        cheqNumber: this.cheqGroupControl.get("cheqNumberControl")?.value,
        entityId : (this.cheqGroupControl.get("entityControl")?.value as IEntity).id,
        typeId : (this.cheqGroupControl.get("cheqTypeControl")?.value as ICheqType).id,
        stateId : this.data.stateId,
        bankBusinessUserId: this.data.bankBusinessUserId,
        issueDate: moment(this.cheqGroupControl.get("issueDateControl")?.value).toDate(),
        dueDate: this.cheqGroupControl.get("dueDateControl")?.value,
        amount: this.cheqGroupControl.get("cheqAmountControl")?.value,
        createdAt : this.data.createdAt ?? moment().toDate(),
      });
    }
    this.cheqGroupControl.markAllAsTouched();
    return
  }

}
