import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';

export function TransformFromMongoId() {
  return Transform(({ value }: { value: ObjectId }) => value.toString(), {
    toPlainOnly: true,
  });
}
