import UserModel from '../DAO/models/user.model.js'

class UserService {
    async addUser(firstName, lastName, email, password, role = "user") {
        try {
            const user = await UserModel.create({ firstName, lastName, email, password, role });
            return { code: 201, result: { status: "success", message: "User created successfully", payload: user } };
        }
        catch (error) {
            return { code: 400, result: { status: "error", message: "Error adding user" } };
        }
    }
    async login(email, password) {
        try {
            const account = await UserModel.findOne({ email, password });
            if (account) {
                return { code: 200, result: { status: "success", message: "User logged in successfully", payload: account } };
            }
            else {
                return { code: 404, result: { status: "error", message: "Wrong user or password!" } };
            }
        }
        catch (error) {
            return { code: 400, result: { status: "error", message: "Error logging in" } };
        }
    }
};
export default UserService;