import bcrypt from "bcrypt";

//For Hashed Password Using bcrypt
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

//For Comparing Hashed Password Using bcrypt
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
