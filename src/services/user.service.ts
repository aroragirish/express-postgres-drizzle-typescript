import { UserDAO } from '../dao/user.dao';
import { CreateUserInput } from '../validations/user.validation';

export class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  async createUser(data: CreateUserInput & { password: string }) {
    return await this.userDAO.createUser(data);
  }

  async getUserById(id: number) {
    return await this.userDAO.getUserById(id);
  }

  async getAllUsers() {
    return await this.userDAO.getAllUsers();
  }
} 