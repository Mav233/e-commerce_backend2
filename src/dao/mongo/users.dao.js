import { UserModel } from "../../models/user.model.js";

export default class UsersDAO {
    getAll = async () => {
        return await UserModel.find();
    };

    getById = async (id) => {
        return await UserModel.findById(id);
    };

    getByEmail = async (email) => {
        return await UserModel.findOne({ email });
    };

    create = async (user) => {
        return await UserModel.create(user);
    };

    update = async (id, data) => {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    };
}