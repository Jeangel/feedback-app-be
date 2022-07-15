import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Post,
  Param,
  Patch,
} from '@nestjs/common';
import { IRequestUser, RequestUser } from 'src/auth/decorators/user.decorator';
import {
  CreateCommentParamsDTO,
  CreateCommentRequestDTO,
} from 'src/comments/dto/create-comment.dto';
import { ECommentableResourceType } from 'src/comments/enum/commentable-resource-type.enum';
import { CommentsService } from 'src/comments/services/comments.service';
import { CreateSuggestionBodyDTO } from '../dto/create-suggestion.dto';
import {
  UpdateSuggestionParamsDTO,
  UpdateSuggestionsBodyDTO,
} from '../dto/update-suggestion.dto';
import {
  FindAllSuggestionsResponseDTO,
  FindAllSuggestionsQueryParamsDTO,
} from '../dto/find-all-suggestions.dto';
import { FindSuggestionByIdParamsDTO } from '../dto/find-suggestion-by-id.dto';
import { SuggestionsService } from '../services/suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    private suggestionsService: SuggestionsService,
    private commentsService: CommentsService,
  ) {}

  @Get()
  async findAll(
    @Query()
    queryParams: FindAllSuggestionsQueryParamsDTO,
    @RequestUser() user: IRequestUser,
  ): Promise<FindAllSuggestionsResponseDTO> {
    const result = await this.suggestionsService.findAll({
      user,
      ...queryParams,
    });
    return result;
  }

  @Get(':id')
  findById(@Param() params: FindSuggestionByIdParamsDTO) {
    return this.suggestionsService.findById(params.id);
  }

  @Post()
  create(
    @Body() body: CreateSuggestionBodyDTO,
    @RequestUser() user: IRequestUser,
  ) {
    try {
      return this.suggestionsService.create({ ...body, authorId: user.userId });
    } catch (error) {
      throw new HttpException(
        'Could not create suggestion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  update(
    @Body() body: UpdateSuggestionsBodyDTO,
    @Param() params: UpdateSuggestionParamsDTO,
    @RequestUser() user: IRequestUser,
  ) {
    try {
      const dto = { ...body, authorId: user.userId };
      const { id } = params;
      return this.suggestionsService.update({ dto, id });
    } catch (error) {
      throw new HttpException(
        'Could not update suggestion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':resourceId/comments')
  getComments(@Param() params: CreateCommentParamsDTO) {
    return this.commentsService.findByResourceId({
      resourceId: params.resourceId,
    });
  }

  @Post(':resourceId/comments')
  addComment(
    @Body() commentRequestDTO: CreateCommentRequestDTO,
    @Param() params: CreateCommentParamsDTO,
    @RequestUser() user: IRequestUser,
  ) {
    return this.commentsService.create({
      ...commentRequestDTO,
      authorId: user.userId,
      resourceId: params.resourceId,
      resourceType: ECommentableResourceType.suggestion,
    });
  }
}
