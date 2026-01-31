export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUsers = () => {
        return this.dao.getAll();
    };

    getUserById = (id) => {
        return this.dao.getById(id);
    };

    getUserByEmail = (email) => {
        return this.dao.getByEmail(email);
    };

    createUser = (user) => {
        return this.dao.create(user);
    };

    updateUser = (id, data) => {
        return this.dao.update(id, data);
    };
}