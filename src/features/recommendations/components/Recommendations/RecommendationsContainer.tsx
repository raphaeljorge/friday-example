import {
  useRecommendations,
  useDismissRecommendation,
  useRefreshRecommendations,
} from '../../hooks/useRecommendations';
import { Recommendations } from './Recommendations';
import type { DismissRecommendationRequest } from '../../types';

export function RecommendationsContainer() {
  const { data, isLoading } = useRecommendations();
  const dismissRecommendation = useDismissRecommendation();
  const refreshRecommendations = useRefreshRecommendations();

  const handleDismiss = (
    recommendationId: string,
    request: DismissRecommendationRequest
  ) => {
    dismissRecommendation.mutate({
      recommendationId,
      request,
    });
  };

  const handleRefresh = () => {
    refreshRecommendations.mutate();
  };

  return (
    <Recommendations
      groups={data?.data ?? []}
      isLoading={
        isLoading ||
        dismissRecommendation.isPending ||
        refreshRecommendations.isPending
      }
      onDismiss={handleDismiss}
      onRefresh={handleRefresh}
    />
  );
}
