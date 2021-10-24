import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackService } from 'src/feedback/services/feedback.service';
import { Repository } from 'typeorm';
import { SaveVoteDTO } from '../dto/save-vote.dto';
import { VoteEntity } from '../entities/vote.entity';
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
    @InjectRepository(VoteEntity)
    private votesRepository: Repository<VoteEntity>,
    private feedbackService: FeedbackService,
  ) {}

  getVoteByAuthorAndResource({
    authorId,
    resourceId,
  }: IGetVoteByAuthorAndResourceArgs) {
    try {
      return this.votesRepository.findOne({
        where: { authorId, resourceId },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  resourceExists({ resourceId, resourceType }: IResourceExistsArgs) {
    switch (resourceType) {
      case EVotableResourceType.feedback:
        return this.feedbackService.findById(resourceId);
        break;
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
        const vote = VoteEntity.createInstance({
          authorId,
          resourceId,
          value,
        });
        return this.votesRepository.save(vote);
      }

      if (existingVote.value === value) {
        throw new HttpException(
          'Resource already was voted',
          HttpStatus.BAD_REQUEST,
        );
      }

      existingVote.value = value;
      return this.votesRepository.save(existingVote);
    } catch (error) {
      throw error;
    }
  }
}
