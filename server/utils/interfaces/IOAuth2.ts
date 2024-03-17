export default interface IOAuth2 {
    service: "gmail"
    type: `OAuth2`;
    user: string;
    accessToken: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}