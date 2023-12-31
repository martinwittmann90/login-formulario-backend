import express from 'express';
import UserService from "../services/dbuser.service.js";
import { isUser, isAdmin } from "../middleware/auth.js"
const usersService = new UserService();

const sessionsRouter = express.Router();

sessionsRouter.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    const response = await usersService.addUser(firstName, lastName, email, password, role);
    return res.status(response.code).json(response.result);
});
sessionsRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const response = await usersService.login(email, password);
    if (response.code === 200) {
        req.session.user = response.result.payload;
    }
/*     const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123';
    if (isAdmin) {
        req.session.email = email;
        req.session.isAdmin = true;
        return res.redirect('home');
    }
 */
    return res.status(response.code).json(response.result);
});

sessionsRouter.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Error! Couldn't logout!" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logout succesfully!" });
    });
});

/* sessionsRouter.get('/administration', isUser, isAdmin, (req, res) => {
    return res.send('Data');
}); */

export default sessionsRouter;