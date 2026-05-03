import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({ name: 'translate', standalone: true, pure: true })
export class TranslatePipe implements PipeTransform {
  private ts = inject(TranslationService);

  transform(key: string): string {
    return this.ts.get(key);
  }
}
