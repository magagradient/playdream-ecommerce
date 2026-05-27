module.exports = (models) => {
  // users - passwordResets 
  models.Users.hasMany(models.PasswordResets, {
    foreignKey: "id_user",
    as: "passwordResets"
  });

  models.PasswordResets.belongsTo(models.Users, {
    foreignKey: "id_user",
    as: "user"
  });

  // users - passwordChanges:
  models.Users.hasMany(models.PasswordChanges, {
    foreignKey: "id_user",
    as: "passwordChanges"
  });

  models.PasswordChanges.belongsTo(models.Users, {
    foreignKey: "id_user",
    as: "userPasswordChanges"
  });

  // users - downloadLinks:
  models.Users.hasMany(models.DownloadLinks, {
    foreignKey: "id_user",
    as: "downloadLinks"
  });

  models.DownloadLinks.belongsTo(models.Users, {
    foreignKey: "id_user",
    as: "userDownload"
  });

  // downloadLinks - products: 
  models.Products.hasMany(models.DownloadLinks, {
    foreignKey: "id_product",
    as: "downloadLinks"
  });
  models.DownloadLinks.belongsTo(models.Products, {
    foreignKey: "id_product",
    as: "product"
  });

  // users - coupons (opcional, si se usan por usuario)
  models.Users.belongsToMany(models.Coupons, {
    through: models.UserCoupons,
    foreignKey: "id_user",
    as: "coupons"
  });

  models.Coupons.belongsToMany(models.Users, {
    through: models.UserCoupons,
    foreignKey: "id_coupon",
    as: "users"
  });


  // users - refreshTokens:
  models.Users.hasMany(models.RefreshTokens, {
    foreignKey: "id_user",
    as: "refreshTokens"
  });

  models.RefreshTokens.belongsTo(models.Users, {
    foreignKey: "id_user",
    as: "user"
  });
};
