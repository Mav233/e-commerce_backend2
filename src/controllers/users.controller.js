import {
    getUsersService,
    getUserByIdService
} from "../services/users.service.js";
import UserDTO from "../dto/user.dto.js";

export const getUsers = async (req, res) => {
    try {
        const users = await getUsersService();
        const usersDTO = users.map(user => new UserDTO(user));

        res.json({
            status: "success",
            payload: usersDTO
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await getUserByIdService(uid);

        if (!user) {
            return res.status(404).json({
                status: "error",
                error: "Usuario no encontrado"
            });
        }

        res.json({
            status: "success",
            payload: new UserDTO(user)
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
};