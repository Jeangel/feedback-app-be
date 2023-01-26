export enum ESuggestionStatus {
  suggestion = 'Suggestion',
  planned = 'Planned',
  inProgress = 'In-Progress',
  live = 'Live',
}

export const ESuggestionStatusDescription = {
  [ESuggestionStatus.suggestion]: 'Ideas waiting for review',
  [ESuggestionStatus.planned]: 'Ideas prioritized for research',
  [ESuggestionStatus.inProgress]: 'Currently being developed',
  [ESuggestionStatus.live]: 'Released features',
};
