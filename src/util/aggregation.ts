export const sanitizeAggregationPipeline = (steps: any[]) => {
  return steps.filter((step) => !!step);
};
