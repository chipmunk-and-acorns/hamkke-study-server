import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  transform(value: any): number[] {
    if (!Array.isArray(value)) {
      throw new BadRequestException('Validation failed. Not an array.');
    }

    return value.map((item: any) => {
      const parsed = parseInt(item, 10);
      if (isNaN(parsed)) {
        throw new BadRequestException(
          `Validation failed. '${item}' is not an integer.`,
        );
      }
      return parsed;
    });
  }
}
