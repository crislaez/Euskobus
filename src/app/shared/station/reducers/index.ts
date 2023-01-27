import { combineReducers } from "@ngrx/store";
import * as fromStationMulti from "./station-multi.reducer";

export const combineFeatureKey = 'station';

export interface CombineState {
  [fromStationMulti.stationMultiFeatureKey]: fromStationMulti.State;

};

export const reducer = combineReducers({
  [fromStationMulti.stationMultiFeatureKey]: fromStationMulti.reducer,
});
