import { ValueTransformer } from 'typeorm';
import { Hash } from '../../utils/Hash';

export class PasswordTransformer implements ValueTransformer {
  to(value: string | Buffer) {
    return Hash.make(value);
  }

  from(value: unknown) {
    return value;
  }
}
