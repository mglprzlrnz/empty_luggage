const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10; 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: 'The email is required'
    },
    password: {
        type: String,
        required: 'The password is required'
    },
    name: {
        type: String,
        required: 'The name is required'
    },
    surname: {
        type: String,
        required: 'The surname is required'
    }
}, {timestamps: true});

userSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) { return next(err); }
        else {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) { return next(err); }
                else {
                    user.password = hash;
                    return next();
                }
            })
        }
    })
});

userSchema.methods.checkPassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
}

const User = mongoose.model('User', userSchema);
module.exports = User;