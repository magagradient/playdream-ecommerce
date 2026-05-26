const {
  Orders,
  Users,
  OrdersProducts,
  Products,
} = require("../../../database/indexModels");

const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const getOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id_user", "name", "email"],
        },
        {
          model: Products,
          as: "orderedProducts",
          through: {
            attributes: ["quantity", "unit_price", "artist_name", "artist_bio", "music_url"],
          },
          attributes: ["id_product", "title"],
        },
      ],
      order: [["order_date", "DESC"]],
    });

    const ordersData = orders.map((o) => o.get({ plain: true }));

    if (ordersData.length === 0) {
      return errorResponse(res, "not_found", "No hay órdenes.", "admin_getOrders", 404);
    }

    return successResponse(res, ordersData, "admin_getOrders");
  } catch (error) {
    console.error("🔴 Error admin getOrders:", error);
    return errorResponse(res, "server_error", "Error interno del servidor.", "admin_getOrders", 500);
  }
};

module.exports = getOrders;