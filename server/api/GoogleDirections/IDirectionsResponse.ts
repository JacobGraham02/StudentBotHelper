import IRoute from "./IRoute";

export default interface IDirectionsResponse {
    routes: IRoute[];
    status: string;
}