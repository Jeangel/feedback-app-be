import { Controller, Post, Body } from '@nestjs/common';
import { VotesService } from '../services/votes.service';
import { SaveVoteBodyDTO } from '../dto/save-vote.dto';
import { IRequestUser, RequestUser } from 'src/auth/decorators/user.decorator';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  save(
    @Body() saveVoteRequestDTO: SaveVoteBodyDTO,
    @RequestUser() user: IRequestUser,
  ) {
    return this.votesService.save({
      ...saveVoteRequestDTO,
      authorId: user.userId,
    });
  }
}
