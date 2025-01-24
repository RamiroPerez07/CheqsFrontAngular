import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core'; // Importante para definir la localización
import localeEs from '@angular/common/locales/es-AR';  // Localización de Argentina
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { registerLocaleData } from '@angular/common';
import 'moment/locale/es';


// Registrar la localización de Argentina (o la que necesites)
registerLocaleData(localeEs, 'es-ES');

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      //withInterceptors([ErrorResponseInterceptor]),
    ),
    provideToastr({timeOut: 1500, preventDuplicates: false}),
    {provide: LOCALE_ID, useValue: "es-ES"},
  ]
};
