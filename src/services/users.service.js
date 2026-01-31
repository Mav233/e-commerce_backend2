import UsersRepository from "../repositories/users.repository.js";
import { usersDAO } from "../dao/index.js";

const usersRepository = new UsersRepository(usersDAO);

export const getUsersService = async () => {
    return await usersRepository.getUsers();
};

export const getUserByIdService = async (id) => {
    return await usersRepository.getUserById(id);
};

export const getUserByEmailService = async (email) => {
    return await usersRepository.getUserByEmail(email);
};

export const createUserService = async (user) => {
    return await usersRepository.createUser(user);
};