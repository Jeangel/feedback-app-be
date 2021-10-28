import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FeedbackService } from 'src/feedback/services/feedback.service';
import { Model } from 'mongoose';
import { SaveVoteDTO } from '../dto/save-vote.dto';
import { Vote, VoteDocument } from '../schemas/vote.schema';
import { EVotableResourceType } from '../enum/votable-resource-type';

interface IGetVoteByAuthorAndResourceArgs {
  authorId: string;
  resourceId: string;
}

interface IResourceExistsArgs {
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

  resourceExists({ resourceId, resourceType }: IResourceExistsArgs) {
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

  async create({ authorId, resourceId, resourceType, value }: SaveVoteDTO) {
    try {
      const resourceExists = await this.resourceExists({
        resourceId,
        resourceType,
      });

      if (!resourceExists) {
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
        return vote.save();
      }

      if (existingVote.value === value) {
        throw new HttpException(
          'Resource already was voted',
          HttpStatus.BAD_REQUEST,
        );
      }

      existingVote.value = value;
      return existingVote.save();
    } catch (error) {
      throw error;
    }
  }
}
