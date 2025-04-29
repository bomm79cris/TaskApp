import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AuthComponent } from '../auth/auth.component';


@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<AuthComponent> {
  canDeactivate(component: AuthComponent): boolean {
    return !component.hasUnsavedChanges || confirm('Tienes cambios sin guardar. ¿Deseas salir?');
  }
}
