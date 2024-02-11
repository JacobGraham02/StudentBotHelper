import IDistance from "./IDistance";
import IDuration from "./IDuration";

export default interface IStep {
	distance: IDistance;
	duration: IDuration;
	html_instructions: string;
	polyline: {
	  points: string;
	};
	travel_mode: string;
	// Add more step properties as needed
  }