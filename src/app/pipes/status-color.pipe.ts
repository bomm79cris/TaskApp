import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusColor' })
export class StatusColorPipe implements PipeTransform {
  transform(status: 'pendiente' | 'completada'): string {
    return status === 'completada' ? 'green' : 'red';
  }
}
