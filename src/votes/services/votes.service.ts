import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FeedbackService } from 'src/feedback/services/feedback.service';
import { Model } from 'mongoose';
import { SaveVoteRequestDTO } from '../dto/save-vote.dto';
import { Vote, VoteDocument } from '../schemas/vote.schema';
import { EVotableResourceType } from '../enum/votable-resource-type.enum';
import { plainToClass } from 'class-transformer';
import { MyVoteDTO } from '../dto/my-vote.dto';

interface IGetVoteByAuthorAndResourceArgs {
  authorId: string;
  resourceId: string;
}

interface IIsResourceCreatedArgs {
  resourceId: string;
  resourceType: EVotableResourceType;
}

@Injectable()
export class VotesService {
  constructor(
    @InjectModel(Vote.name)
    private voteModel: Model<VoteDocument>,
    private feedbackService: FeedbackService,
  ) {}

  getVoteByAuthorAndResource({
    authorId,
    resourceId,
  }: IGetVoteByAuthorAndResourceArgs) {
    try {
      return this.voteModel
        .findOne({
          $and: [{ resourceId: resourceId }, { authorId: authorId }],
        })
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  isResourceCreated({ resourceId, resourceType }: IIsResourceCreatedArgs) {
    switch (resourceType) {
      case EVotableResourceType.feedback:
        return this.feedbackService.findById(resourceId);
      default:
        throw new HttpException(
          'Given resourceType is not supported',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async save({
    authorId,
    resourceId,
    resourceType,
    value,
  }: SaveVoteRequestDTO) {
    try {
      if (value === -1) {
        throw new HttpException(
          'Negatives votes are not supported yet',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isResourceCreated = await this.isResourceCreated({
        resourceId,
        resourceType,
      });

      if (!isResourceCreated) {
        throw new HttpException('Resource was not found', HttpStatus.NOT_FOUND);
      }
      const existingVote = await this.getVoteByAuthorAndResource({
        authorId,
        resourceId,
      });
      if (!existingVote) {
        const vote = new this.voteModel({
          authorId,
          resourceId,
          resourceType,
          value,
        });
        const savedVote = await vote.save();
        return plainToClass(MyVoteDTO, savedVote);
      }

      if (existingVote.value === value) {
        throw new HttpException(
          'Resource already was voted',
          HttpStatus.BAD_REQUEST,
        );
      }

      existingVote.value = value;
      const savedVote = await existingVote.save();
      return plainToClass(MyVoteDTO, savedVote);
    } catch (error) {
      throw error;
    }
  }
}
