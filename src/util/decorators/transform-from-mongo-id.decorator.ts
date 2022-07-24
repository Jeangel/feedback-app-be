import { Transform, TransformFnParams } from 'class-transformer';
import { ObjectId } from 'mongodb';

interface ITransformParams extends Omit<TransformFnParams, 'value' | 'obj'> {
  value: ObjectId;
  obj: {
    _id: ObjectId;
    [key: string]: any;
  };
}

export function TransformFromMongoId() {
  return Transform(
    (params: ITransformParams) => params.obj[params.key]?.toString(),
    {
      toPlainOnly: true,
      toClassOnly: true,
    },
  );
}
