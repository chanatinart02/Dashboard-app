import User from "../mongodb/models/user.js";

const getAllUsers = async (req, res) => {};
const createUser = async (req, res) => {};
const getUserInfoByID = async (req, res) => {};

export {
  getAllUsers,
  createUser,
  getUserInfoByID,
} from "../controllers/user.controller";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/").post(createUser);
router.route("/:id").get(getUserInfoByID);

export default router;
