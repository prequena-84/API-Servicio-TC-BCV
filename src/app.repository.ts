import { Injectable } from '@nestjs/common';

@Injectable()
export class AppRepository {
  welcomeAPI(text: string): string {
    return text;
  };
};