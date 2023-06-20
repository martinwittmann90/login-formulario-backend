import express from 'express';
import {isUser, isAdmin} from "../middleware/auth.js";
import UserModel from '../DAO/models/user.model.js'

const authRouter = express.Router();

authRouter.get('/profile', isUser, (req, res) => {
    const user = {email: req.session.email, isAdmin: req.session.isAdmin};
    return res.render('profile', {user: user});
});

authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
        return res.status(500).render('error', {error: 'Session can not be closed'});
    }
        return res.redirect('/auth/login');
    });
});

authRouter.get('/administration', isUser, isAdmin, (req, res) => {
    return res.send('Data');
});

authRouter.get('/login', (req, res) => {
    return res.render("login", {});
});

authRouter.get('/products', (req, res) => {
    try{
        const user = UserModel.findOne({email: req.session.email});
        if (user) {
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            };
            return res.render('products', { user: userData });
        } else {
            return res.render('products', { user: null });
        }
    } catch (error) {
        console.error(error);
        return res.render('products', { user: null, error: 'Error retrieving user data' });
    }
});

authRouter.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).render('error', {error: 'email and password required'});
        }
        const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123';
        if (isAdmin) {
            req.session.email = email;
            req.session.isAdmin = true;
            return res.redirect('/auth/products');
        }
        const foundUser = await UserModel.findOne({email: email});
        if (foundUser && foundUser.password === password) {
            req.session.email = foundUser.email;
            req.session.isAdmin = foundUser.isAdmin;
            return req.session.save(() => {
                return res.redirect('/auth/products');
            });
        }else{
            return res.status(401).render('error', {error:'wrong email or password'})
        }
    }catch(error){
        console.error(error);
        res.status(500).json({status: 'error', message: 'Internal server error'});
    }
});

authRouter.get('/register', (req, res) => {
    return res.render("register", {});
});

authRouter.post('/register', async (req, res) => {
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
    }
});
export default authRouter;