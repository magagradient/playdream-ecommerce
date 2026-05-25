const { OrdersProducts, Orders } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const soldCredit = async (req, res) => {
    try {
        const { id } = req.params;

        const orderProduct = await OrdersProducts.findOne({
            where: { id_product: id },
            include: [{
                model: Orders,
                as: "order",
                where: { status: "paid" },
                required: true,
            }],
        });

        if (!orderProduct || (!orderProduct.artist_name && !orderProduct.artist_bio && !orderProduct.music_url)) {
            return responseHelper.successResponse(res, null, "sold_credit");
        }

        return responseHelper.successResponse(res, {
            artist_name: orderProduct.artist_name,
            artist_bio: orderProduct.artist_bio,
            music_url: orderProduct.music_url,
        }, "sold_credit");

    } catch (error) {
        console.error("Error al obtener sold credit:", error);
        return responseHelper.errorResponse(res, "server_error", error.message, "sold_credit", 500);
    }
};

module.exports = soldCredit;