import { NodeMailerConfigDto } from "./nodemailerConfig.dto.js";

function configGenerator(config: NodeMailerConfigDto): NodeMailerConfigDto{
	const nodemailerConfig: NodeMailerConfigDto = {
		service: config.service,
		auth: {
			user: config.auth.user,
			pass: config.auth.pass,
		},
	};
	return nodemailerConfig;
};

export default configGenerator;