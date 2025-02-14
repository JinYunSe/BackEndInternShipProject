import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.services.js';
import { UserController } from '../controllers/user.controller.js';

const router = express.Router();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/signup', userController.signUp);

router.get('/login', userController.login);

export default router;
