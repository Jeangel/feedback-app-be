import { IsNotEmpty, Length } from 'class-validator';

export class CreateFeedbackDTO {
  @Length(5, 50)
  title: string;
  @Length(20, 600)
  description: string;
  @IsNotEmpty()
  category: string;
}
