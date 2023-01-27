
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CombineState, combineFeatureKey } from '../reducers';
import { scheduleMultiFeatureKey } from '../reducers/schedule-multi.reducer';

export const selectCombineState = createFeatureSelector<CombineState>(combineFeatureKey);


/* === MULTI === */
export const selectMultiState = createSelector(
  selectCombineState,
  (state) => state[scheduleMultiFeatureKey]
)

export const selectStatus = createSelector(
  selectMultiState,
  (state) => state?.status
);

export const selectSchedules = createSelector(
  selectMultiState,
  (state) => state?.schedules
);

export const selectErrors = createSelector(
  selectMultiState,
  (state) => state?.error
);
