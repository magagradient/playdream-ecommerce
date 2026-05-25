const { OrdersProducts, Orders } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const updateCredit = async (req, res) => {
    try {
        const { id_order, id_product } = req.params;
        const { artist_name, artist_bio, music_url } = req.body;
        const { id_user } = req.user;

        // Verificar que la orden pertenece al usuario
        const order = await Orders.findOne({
            where: { id_order, id_user, status: "paid" }
        });

        if (!order) {
            return responseHelper.errorResponse(res, "forbidden", "No tenés acceso a esta orden.", "update_credit", 403);
        }

        const orderProduct = await OrdersProducts.findOne({
            where: { id_order, id_product }
        });

        if (!orderProduct) {
            return responseHelper.errorResponse(res, "not_found", "Producto no encontrado en la orden.", "update_credit", 404);
        }

        orderProduct.artist_name = artist_name ?? orderProduct.artist_name;
        orderProduct.artist_bio = artist_bio ?? orderProduct.artist_bio;
        orderProduct.music_url = music_url ?? orderProduct.music_url;

        await orderProduct.save();

        return responseHelper.successResponse(res, orderProduct, "update_credit");

    } catch (error) {
        console.error("Error al actualizar crédito:", error);
        return responseHelper.errorResponse(res, "server_error", error.message, "update_credit", 500);
    }
};

module.exports = updateCredit;