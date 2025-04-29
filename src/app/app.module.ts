import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageComponent } from './message/message.component';
import { LoadingComponent } from './loading/loading.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule } from './login/login.module';
import { MessagesModule } from 'primeng/messages';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { CardModule } from 'primeng/card';
import { StatusColorPipe } from './pipes/status-color.pipe';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    LoadingComponent,
    MessageComponent,
    StatusColorPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    LoginModule,
    MessagesModule,
    CardModule,
    InputSwitchModule
  ],
  providers: [
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UnsavedChangesGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
