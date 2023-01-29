import { Types } from 'mongoose';
import { FindBoardColumnDTO } from '../dto/find-board-suggestions.dto';
import {
  ESuggestionStatus,
  ESuggestionStatusDescription,
} from '../enum/suggestion-status';

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

export const makeBoardAggregate = () => {
  const groupSuggestions = {
    $group: {
      _id: '$status',
      suggestions: {
        $push: '$$ROOT',
      },
    },
  };
  return [groupSuggestions];
};

export const makeSuggestionsStatsAggregate = () => {
  const statsAggregate = [
    {
      $group: {
        _id: '$status',
        total: {
          $count: {},
        },
      },
    },
    {
      $group: {
        _id: 'countByStatus',
        statsArray: {
          $push: {
            k: '$_id',
            v: '$total',
          },
        },
      },
    },
    {
      $project: {
        countByStatus: {
          $arrayToObject: '$statsArray',
        },
        _id: 0,
      },
    },
  ];
  return statsAggregate;
};

export const sortBoardSuggestionColumns = (columns: FindBoardColumnDTO[]) => {
  const columnSortValue = {
    [ESuggestionStatus.suggestion]: 0,
    [ESuggestionStatus.planned]: 1,
    [ESuggestionStatus.inProgress]: 2,
    [ESuggestionStatus.live]: 3,
  };
  return columns.sort(
    (a, b) => columnSortValue[a._id] - columnSortValue[b._id],
  );
};

export const sanitizeBoardSuggestions = (columns: FindBoardColumnDTO[]) => {
  const sanitizedColumns = Object.entries(
    ESuggestionStatusDescription,
  ).map<FindBoardColumnDTO>(
    ([status, description]) =>
      new FindBoardColumnDTO({
        _id: status as ESuggestionStatus,
        description,
        suggestions: columns.find((e) => e._id === status)?.suggestions || [],
      }),
  );
  return sortBoardSuggestionColumns(sanitizedColumns);
};
