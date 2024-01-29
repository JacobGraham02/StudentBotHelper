import ICandidate from "./ICandidate";

export default interface IGooglePlacesResponse {
    candidates: ICandidate[];
    status: string;
}