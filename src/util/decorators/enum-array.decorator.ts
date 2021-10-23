import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEnumArray(
  givenEnum: Record<string, unknown>,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEnumArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [givenEnum],
      options: validationOptions,
      validator: {
        validate(values: any, args: ValidationArguments) {
          if (!Array.isArray(values)) return false;

          const [givenEnum] = args.constraints;
          const enumValues = Object.values(givenEnum);
          return values.every((value) => enumValues.includes(value));
        },
      },
    });
  };
}
