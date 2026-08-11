import bcrypt from "bcrypt";


const generateHash = async (password) => {
  try {
    const saltRounds = 7;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error while creating hash...",error);
  }
};

const compareHash = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export { generateHash, compareHash };
