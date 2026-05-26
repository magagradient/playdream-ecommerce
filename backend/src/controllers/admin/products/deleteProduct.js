const { Products } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(id);

    if (!product) {
      return errorResponse(res, "not_found", "Producto no encontrado.", "admin_deleteProduct", 404);
    }

    if (product.is_deleted) {
      return errorResponse(res, "conflict", "El producto ya está eliminado.", "admin_deleteProduct", 409);
    }

    await product.update({ is_deleted: true });

    return successResponse(res, { id_product: product.id_product }, "admin_deleteProduct");
  } catch (error) {
    console.error("🔴 Error admin deleteProduct:", error);
    return errorResponse(res, "server_error", "Error interno del servidor.", "admin_deleteProduct", 500);
  }
};

module.exports = deleteProduct;