const jwtProvider = require("../connectDb/jwtProvider");
const userService = require("../services/user.services");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    const userId = jwtProvider.getUserIdFromToken(token);

    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next(); // Proceed if authenticated
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

module.exports = authenticate;
