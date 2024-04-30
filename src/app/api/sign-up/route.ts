import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    console.log("\nreached line 9 in route.ts\n");
    const { username, email, password } = await request.json();
    console.log("\nreaching here\n");
    console.log(username, email, password);

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("reached 30");
    console.log("\n", existingUserByEmail, "\n");

    if (existingUserByEmail) {
      console.log("reached 32");
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 },
        );
      } else {
        console.log("reached 40");
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 36000000);
        await existingUserByEmail.save();
      }
    } else {
      console.log("reached 49\n");
      console.log(password);
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("reached 51\n");

      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);

      console.log("Because of this mostly");
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user internal", error);
    return Response.json(
      { success: false, message: "DBError registering user" },
      { status: 500 },
    );
  }
}
