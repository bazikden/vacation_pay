console.log('user-init',process.env.MONGO_INITDB_ROOT_USERNAME)
console.log('pwd--init',process.env.MONGO_INITDB_ROOT_PASSWORD)

db.createUser(
    {
        user: "baz",
        pwd: 12345,
        roles: [
            {
                role: "readWrite",
                db: process.env.MONGO_INITDB_DATABASE
            }
        ]
    }
);