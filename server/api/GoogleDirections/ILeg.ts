import IDistance from "./IDistance";
import IDuration from "./IDuration";
import ILocation from "./ILocation";
import IStep from "./IStep";

export default interface ILeg {
	start_location: ILocation;
	end_location: ILocation;
	distance: IDistance;
	duration: IDuration;
	steps: IStep[];
  }