import { User } from "@/lib/models/user";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import bcrypt from "bcryptjs/dist/bcrypt";
import slugify from "slugify";

export async function register(formData) {
  const { userName, email, password, passwordRepeat } = Object.fromEntries(formData);

  // Vérification côté serveur si jamais l'utilisateur a bypass la vérification côté client (via la console par exemple)
  if(userName.length < 3) {
    throw new Error("Username is too short");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if(!emailRegex.test(email)){
    throw new Error("E-mail format isn't correct");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if(!passwordRegex.test(password)) {
    throw new Error("Password doesn't respect a rule");
  }

  if(password !== passwordRepeat) {
    throw new Error("Passwords don't match");
  }

  try {
    connectToDB();
    const user = await User.findOne({ userName });

    if(user) {
      throw new Error("Username already exists");
    }

    const normalizedUserName = slugify(userName, { lower: true, strict: true });

    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      normalizedUserName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("User saved to db");
    
    return { success: true };

  } catch(error) {
    console.log("Error while signing up the user: ", error);
    throw new Error(error.message || "An error occurred while signing up the user");
  }


}