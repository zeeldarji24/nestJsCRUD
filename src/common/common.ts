import { hash } from 'bcrypt';

export const convertPassword = async function (password: string) {

    return hash(password, 10);
}

module.exports = {
    convertPassword
}