module.exports = {
    async findOne(tx, entity, where) {
        return tx.run(
            SELECT.one.from(entity).where(where)
        );
    },

    async findMany(tx, entity, where = null, orderBy = null) {
        const query = SELECT.from(entity);

        if (where && Object.keys(where).length > 0) {
            query.where(where);
        }

        if (orderBy) {
            query.orderBy(orderBy);
        }

        return tx.run(query);
    },

    async findManyByQuery(tx, entity, buildQuery) {
        const query = buildQuery(SELECT.from(entity));

        return tx.run(query);
    },

    async insert(tx, entity, data) {
        return tx.run(
            INSERT.into(entity).entries(data)
        );
    },

    async insertMany(tx, entity, rows) {
        return tx.run(
            INSERT.into(entity).entries(rows)
        );
    },

    async update(tx, entity, where, data) {
        return tx.run(
            UPDATE(entity).set(data).where(where)
        );
    },

    async remove(tx, entity, where) {
        return tx.run(
            DELETE.from(entity).where(where)
        );
    }
};