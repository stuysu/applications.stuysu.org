import Axios from "axios";
import FormData from "form-data";
import multer from "multer";
import nextConnect from "next-connect";
import { IMGBB_API_KEY } from "../../constants";
import authChecker from "../../utils/middleware/authChecker";
import errorHandler from "../../utils/middleware/errorHandler";
import HTTPError from "./../../utils/errors/HTTPError";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Returns a Multer instance that provides several methods for generating
// middleware that process files uploaded in multipart/form-data format.
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 20 },
}).single("file");

const apiRoute = nextConnect({ onError: errorHandler });
// Adds the middleware to Next-Connect
apiRoute.use(uploadMiddleware);
apiRoute.use(authChecker);

apiRoute.post(async (req, res) => {
  if (!req.signedIn || !req.user) {
    throw new HTTPError(
      401,
      "You need to provide authentication to use this endpoint"
    );
  }

  if (!req.user.adminPrivileges) {
    throw new HTTPError(403, "You need to be an admin to use this endpoint");
  }

  const file = req.file;

  if (!file) {
    throw new HTTPError(400, "There was no file included with this request");
  }

  if (!file.mimetype?.startsWith("image/")) {
    throw new HTTPError(400, "The uploaded file is not a valid picture");
  }

  if (!IMGBB_API_KEY) {
    throw new HTTPError(
      503,
      "ImgBB api key is not configured. Ask someone on the IT team to take care of this"
    );
  }

  const formData = new FormData();
  formData.append("image", file.buffer, file.originalname);
  formData.append("key", IMGBB_API_KEY);

  const config = {
    method: "post",
    url: "https://api.imgbb.com/1/upload",
    headers: {
      ...formData.getHeaders(),
    },
    data: formData,
  };

  const { data } = await Axios(config);

  res.json({ success: true, data: data.data.image });
});

export default apiRoute;
