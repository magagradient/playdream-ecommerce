const { Orders, OrdersProducts, Products, ProductImages } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const myPurchases = async (req, res) => {
    try {
        const { id_user } = req.user;

        const orders = await Orders.findAll({
            where: { id_user, status: "paid" },
            order: [["order_date", "DESC"]],
            include: [{
              model: OrdersProducts,
              as: "orderDetails",
              include: [{
                  model: Products,
                  as: "product",
                  include: [{
                      model: ProductImages,
                      as: "images",
                      required: false,
                  }]
              }]
          }]
        });

        return responseHelper.successResponse(res, orders, "my_purchases");

    } catch (error) {
        console.error("Error al obtener compras:", error);
        return responseHelper.errorResponse(res, "server_error", error.message, "my_purchases", 500);
    }
};

module.exports = myPurchases;