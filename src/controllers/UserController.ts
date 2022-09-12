import jwt, { Jwt } from 'jsonwebtoken';
import UserModel from '../models/UserModel';

const createToken = (_id: String) => jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
