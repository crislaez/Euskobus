import { combineReducers } from "@ngrx/store";
import * as fromSchedule from "./schedule-multi.reducer";

export const combineFeatureKey = 'schedule';

export interface CombineState {
  [fromSchedule.scheduleMultiFeatureKey]: fromSchedule.State;
};

export const reducer = combineReducers({
  [fromSchedule.scheduleMultiFeatureKey]: fromSchedule.reducer,
});
