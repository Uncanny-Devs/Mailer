export interface NodeMailerConfigDto {
    service: string;
    auth: {
        user: string;
        pass: string;
    };
}