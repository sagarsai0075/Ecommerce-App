import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    )
  ]
});
