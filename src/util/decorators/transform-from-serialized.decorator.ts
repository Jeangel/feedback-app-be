import { Transform, plainToClass } from 'class-transformer';

export function TransformFromSerialized(ClassConstructor: new () => any) {
  return Transform(
    ({ value }) => plainToClass(ClassConstructor, JSON.parse(value)),
    {
      toClassOnly: true,
    },
  );
}
