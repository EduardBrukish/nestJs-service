import { NotFoundException } from '@nestjs/common';

export class CommonNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message || 'Not found');
  }
}
