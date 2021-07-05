import { randomBytes } from "crypto";
import { google } from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../../constants";

export default async function getAnonymitySecret(access_token) {
	const oAuth2Client = new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET
	);

	oAuth2Client.setCredentials({ access_token });
	const drive = google.drive({ version: "v3", auth: oAuth2Client });

	// Means that a file was already generated and we can get its contents
	if (this.googleDriveAnonymityFileId) {
		try {
			const { data } = await drive.files.get({
				fileId: this.googleDriveAnonymityFileId,
				alt: "media",
			});

			return data;
		} catch (e) {
			// If the request fails the user likely removed permissions and reinstated them
			// Nothing we can do besides generate a new anonymous id
		}
	}

	// Will resolve to a 32 character string
	const anonymitySecret = randomBytes(16).toString("hex");

	const fileMetadata = {
		name: "anonymousId.txt",
		parents: ["appDataFolder"],
	};
	const media = {
		mimeType: "text/plain",
		body: anonymitySecret,
	};

	const { data } = await drive.files.create({
		resource: fileMetadata,
		media: media,
		fields: "id",
	});

	this.googleDriveAnonymityFileId = data.id;
	await this.save();

	return anonymitySecret;
}
