const { Users } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: [
        "id_user",
        "name",
        "email",
        "role",
        "is_deleted",
        "avatar_url",
        "registration_date",
      ],
      order: [["registration_date", "DESC"]],
    });

    if (users.length === 0) {
      return errorResponse(res, "not_found", "No hay usuarios.", "admin_getUsers", 404);
    }

    const usersData = users.map((u) => u.get({ plain: true }));

    return successResponse(res, usersData, "admin_getUsers");
  } catch (error) {
    console.error("🔴 Error admin getUsers:", error);
    return errorResponse(res, "server_error", "Error interno del servidor.", "admin_getUsers", 500);
  }
};

module.exports = getUsers;