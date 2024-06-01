import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Enviroment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnviromentVariables {
  @IsEnum(Enviroment)
  NODE_ENV: Enviroment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  DB_USERNAME: string;

  @IsString()
  PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  //* plainInstance converts plain (literal) object to class (constructor) object.
  // * Also works with arrays
  const validatedConfig = plainToInstance(EnviromentVariables, config, {
    /**
* enableImplicitConversion will tell class-transformer that if it sees a
primitive that is currently a string (like a boolean or a number) to assume it
should be the primitive type instead and transform it, even though @Type(() =>
Number) or @Type(() => Boolean) isn't used
*/
    enableImplicitConversion: true,
  });

  /**
   * Performs sync validation of the given object.
   * Note that this method completely ignores async validations.
   * If you want ot porperly perform validation you need to call validate method instead
   */
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
