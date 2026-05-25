const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const validateSchema = require("../middlewares/validateSchema");
const {
    orderCreateSchema,
    orderUpdateSchema,
    idParamSchema,
    userIdParamSchema
} = require("../validators/orders");
const ordersPaginationSchema = require("../validators/orders/ordersPaginationSchema");


// Controllers
const index = require("../controllers/orders/get/index");
const show = require("../controllers/orders/get/show");
const byUser = require("../controllers/orders/get/byUser");
const myPurchases = require("../controllers/orders/get/myPurchases");

const create = require("../controllers/orders/post/create");

const update = require("../controllers/orders/put/update");

const destroy = require("../controllers/orders/delete/destroy");

/* -------------------------------------------------------------- */

// Routes
// GET all orders
router.get("/", authMiddleware(), validateSchema(ordersPaginationSchema, "query"), index);

// GET my purchases
router.get("/my-purchases", authMiddleware(), myPurchases);

// GET single order by ID
router.get("/:id",
    authMiddleware(),
    validateSchema(idParamSchema, "params"),
    show
);

// GET orders by user
router.get("/user/:id_user",
    authMiddleware(),
    validateSchema(userIdParamSchema, "params"),
    byUser
);


// POST create order
router.post("/",
    authMiddleware(),
    validateSchema(orderCreateSchema, "body"),
    create
);

// PUT update order
router.put("/:id",
    authMiddleware(),
    validateSchema(idParamSchema, "params"),
    validateSchema(orderUpdateSchema, "body"),
    update
);

// DELETE order
router.delete("/:id",
    authMiddleware(),
    validateSchema(idParamSchema, "params"),
    destroy
);

module.exports = router;
