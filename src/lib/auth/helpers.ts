import bcrypt from "bcryptjs";

// define constants


const MINIMUM_PASSWORD_LENGTH = 8;
const MINIMUM_USERNAME_LENGTH = 3;
const MAXIMUM_USERNAME_LENGTH = 15;

const SPECIAL_CHARACTERS_PASSWORD = "!@#$%^&*()-+[]{}_/\\";
const EMAIL_REGEX: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_ROUNDS = 10;


const PASSWORD_REQUIREMENTS = [
    `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long`,
    "The password must have at least 1 uppercase letter",
    "The password must have at least 1 lowercase letter",
    "The password must have at least 1 number",
    "The password must have at least 1 special character"
]

const USERNAME_REQUIREMENTS = [
    `Username must be between ${MINIMUM_USERNAME_LENGTH} and ${MAXIMUM_USERNAME_LENGTH} characters long`,
    "Username must contain at least 1 alphabetical character"
]


export const passwordsMatch = async (testPassword: string, hashedPassword: string): Promise<boolean>=> {
    return await bcrypt.compare(testPassword, hashedPassword);
} 

export const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
} 

export const isStrongPassword = (password: string): boolean | string[][] => {


    let isMinimumLength = password.length >= MINIMUM_PASSWORD_LENGTH;
    let hasLowerLetter = false;
    let hasUpperLetter = false;
    let hasDigit = false;
    let hasSpecialChar = false;

    for (let i = 0; i < password.length; i++) {
        const char = password.charAt(i);

        if (char >= 'a' && char <= 'z') {
            hasLowerLetter = true;
        }
        else if (char >= 'A' && char <= 'Z') {
            hasUpperLetter = true;
        }
        else if (char >= '0' && char <= '9') {
            hasDigit = true;
        }
        else if (SPECIAL_CHARACTERS_PASSWORD.includes(char)) {
            hasSpecialChar = true;
        }
    }


    // all checks are met, so satisfied and unsatisified does not matter 
    if (isMinimumLength && hasLowerLetter && hasUpperLetter && hasDigit && hasSpecialChar) return true;

    const checks = [isMinimumLength, hasUpperLetter, hasLowerLetter, hasDigit, hasSpecialChar];
    const satisfiedRequirements: string[] = [];
    const unsatisfiedRequirements: string[] = [];

    for (let i = 0; i < checks.length; i++) {
        if (checks[i]) {
            satisfiedRequirements.push(PASSWORD_REQUIREMENTS[i]);
        }
        else {
            unsatisfiedRequirements.push(PASSWORD_REQUIREMENTS[i]);
        }
    }

    return [satisfiedRequirements, unsatisfiedRequirements];

}

export const isValidUsername = (username: string): boolean | string[][] => {

    let inLengthRange = username.length >= MINIMUM_USERNAME_LENGTH && username.length <= MAXIMUM_USERNAME_LENGTH;
    let hasLetter = false;

    for (let i = 0; i < username.length; i++) {
        const char = username.charAt(i);
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            hasLetter = true;
            break;
        }
    }

    // all checks are met, so satisfied and unsatisified does not matter 
    if (inLengthRange && hasLetter) return true;

    const checks = [inLengthRange, hasLetter];
    const satisfiedRequirements: string[] = [];
    const unsatisfiedRequirements: string[] = [];

    for (let i = 0; i < checks.length; i++) {
        if (checks[i]) {
            satisfiedRequirements.push(USERNAME_REQUIREMENTS[i]);
        }
        else {
            unsatisfiedRequirements.push(USERNAME_REQUIREMENTS[i]);
        }
    }

    return [satisfiedRequirements, unsatisfiedRequirements];
}

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}