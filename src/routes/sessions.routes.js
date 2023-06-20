import express from 'express';
import UserService from "../services/dbuser.service.js";
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
export default sessionsRouter;


/* authRouter.post('/register', async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).render('error', {error: 'Missing fields'});
    }
    const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123';
    try {
        await UserModel.create({email: email, password: password, firstName: firstName, lastName: lastName, isAdmin: isAdmin});
        req.session.email = email;
        req.session.isAdmin = isAdmin;

        return res.redirect('/auth/profile');
    } catch (e) {
        console.log(e);
        return res.status(400).render('error', { error: 'User could not be created. Try another email'});
    } */