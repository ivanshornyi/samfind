import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ParseArrayPipe implements PipeTransform {
  transform(value: string | string[], metadata: ArgumentMetadata) {
    return Array.isArray(value) ? value : [value];
  }
}
