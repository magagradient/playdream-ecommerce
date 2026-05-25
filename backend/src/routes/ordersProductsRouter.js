const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const validateSchema = require("../middlewares/validateSchema");
const {
    ordersProductsParamsSchema,
    ordersProductsCreateSchema,
    ordersProductsUpdateSchema,
    ordersProductsOnlyOrderParamSchema
} = require("../validators/ordersProducts");


// Controllers
const index = require("../controllers/ordersProducts/get/index");
const byOrder = require("../controllers/ordersProducts/get/byOrder");

const create = require("../controllers/ordersProducts/post/create");

const update = require("../controllers/ordersProducts/put/update");

const updateCredit = require("../controllers/ordersProducts/patch/updateCredit");

const destroy = require("../controllers/ordersProducts/delete/destroy");

/* ---------------------------------- */

// rutas
router.get("/", authMiddleware(), index);

router.get("/:id_order",
    authMiddleware(),
    validateSchema(ordersProductsOnlyOrderParamSchema, "params"),
    byOrder
);

router.post("/",
    authMiddleware(),
    validateSchema(ordersProductsCreateSchema, "body"),
    create
);

router.put("/:id_order/:id_product",
    authMiddleware(),
    validateSchema(ordersProductsParamsSchema, "params"),
    validateSchema(ordersProductsUpdateSchema, "body"),
    update
);

router.patch("/:id_order/:id_product/credit",
  authMiddleware(),
  updateCredit);

router.delete("/:id_order/:id_product",
    authMiddleware(),
    validateSchema(ordersProductsParamsSchema, "params"),
    destroy
);

module.exports = router;
