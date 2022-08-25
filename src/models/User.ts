import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

export interface IUser {
    email: String;
    password: String;
    lastname: String;
    firstname: String;
    birthdate: Date;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: false
        },
        firstname: {
            type: String,
            required: false
        },
        birthdate: {
            type: String,
            required: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

// static signup method
UserSchema.statics.signup = async function (email, password, lastname?, firstname?, birthdate?) {
    console.log('MODEL', email, password);
    // validation
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    if (birthdate && !validator.isDate(birthdate)) {
        throw Error('Birthdate incorrect');
    }

    const userExists = await this.findOne({ email });

    if (userExists) {
        throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email: email, password: hash, lastname: lastname, firstname: firstname });

    return user;
};

// static login method
UserSchema.statics.login = async function (email, password) {
    // validation
    if (!email || !password) throw Error('All fields must be filled');

    const user = await this.findOne({ email });

    if (!user) throw Error('Incorrect Email');

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw Error('Incorrect password');

    return user;
};

export default mongoose.model<IUserModel>('User', UserSchema);
