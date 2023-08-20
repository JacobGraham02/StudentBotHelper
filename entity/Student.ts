import { UUID } from "crypto";

export default class Student {

    private uuid_regex_pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    private username_regex_pattern = /[a-zA-Z ]{0,32}/
    private password_regex_pattern = /[a-zA-Z ]{0,32}/

    private id: UUID;
    private username: string;
    private password: string;
    private discord_username: string;
    private start_location?: string | undefined;
    private school_location?: string | undefined;
    private salt: string;

    constructor(id: UUID, username: string, password: string, discord_username: string, salt: string, start_location?: string, school_location?: string) {
        this.validateId(id);
        this.validateUsername(username);
        this.validatePassword(password);

        this.id = id;
        this.username = username;
        this.password = password;
        this.discord_username = discord_username;
        if (start_location) {
            this.start_location = start_location;
        }
        if (school_location) {
            this.school_location = school_location;
        }
        this.salt = salt;
    }

    private validateId(id: UUID): void {
        if (!id.match(this.uuid_regex_pattern)) {
            throw new Error('The supplied user id is invalid: the id is not in the form of UUIDv4');
        }
    }
    
    private validateUsername(username: string): void {
        if (!username.match(this.username_regex_pattern)) {
            throw new Error('The supplied username is invalid');
        }
    }

    private validatePassword(password: string): void {
        if (!password.match(this.password_regex_pattern)) {
            throw new Error('The supplied password is invalid');
        }
    }

    public studentInformation() {
        return {
            studentId: this.id,
            studentUsername: this.username,
            studentPassword: this.password,
            studentDiscordUsername: this.discord_username,
            studentSalt: this.salt,
            studentStartLocation: this.start_location,
            studentSchoolLocation: this.school_location
        };
    }
}