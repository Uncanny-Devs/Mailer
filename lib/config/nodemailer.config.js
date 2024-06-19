function configGenerator(config) {
    const nodemailerConfig = {
        service: config.service,
        auth: {
            user: config.auth.user,
            pass: config.auth.pass,
        },
    };
    return nodemailerConfig;
}
;
export default configGenerator;
