import IBounds from "./IBounds";
import ILeg from "./ILeg";

export default interface IRoute {
    bounds: IBounds;
	legs: ILeg[];
	overview_polyline: {
	  points: string;
	};
	summary: string;
	warnings: string[];
	waypoint_order: number[];
}