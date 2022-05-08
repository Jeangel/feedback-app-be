import { IsNotEmpty, IsMongoId } from 'class-validator';

export class FindFeedbackByIdDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
