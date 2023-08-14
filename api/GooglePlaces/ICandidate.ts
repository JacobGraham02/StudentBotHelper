import IGeometry from "./IGeometry";
import IOpeningHours from "./IOpeningHours";

export default interface ICandidate {
    formatted_address: string;
    geometry: IGeometry;
    name: string;
    opening_hours: IOpeningHours;
    rating: number;
}