const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RefreshTokens = sequelize.define('RefreshTokens', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING(512),
            allowNull: false,
            unique: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'refresh_tokens',
        timestamps: false,
        freezeTableName: true,
    });

    return RefreshTokens;
};