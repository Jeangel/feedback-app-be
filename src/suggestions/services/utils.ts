import { Types } from 'mongoose';

export const makeCalculateVotesAggregate = (userId: string) => {
  const joinVotes = {
    $lookup: {
      from: 'votes',
      localField: '_id',
      foreignField: 'resourceId',
      as: 'votes',
    },
  };
  const calculateVotes = {
    $addFields: {
      votesCount: { $sum: '$votes.value' },
      myVote: {
        $first: {
          $filter: {
            input: '$votes',
            as: 'vote',
            cond: {
              $eq: ['$$vote.authorId', new Types.ObjectId(userId)],
            },
          },
        },
      },
    },
  };
  return [joinVotes, calculateVotes];
};

export const makeCalculateCommentsAggregate = () => {
  const joinComments = {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'resourceId',
      as: 'comments',
    },
  };
  const calculateComments = {
    $addFields: {
      commentsCount: { $size: '$comments' },
    },
  };
  return [joinComments, calculateComments];
};
