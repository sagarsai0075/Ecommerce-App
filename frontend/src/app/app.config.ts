import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { IMAGE_CONFIG } from '@angular/common';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true
      }
    }
  ]
};
