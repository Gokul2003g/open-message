import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";

// TODO: complete zod validation for verify Code

export async function POST(request: Request) {
  await dbConnect();
  console.log("Because of this3");

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired!",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification code is wrong!",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error checking verification code", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking verification code",
      },
      { status: 500 },
    );
  }
}
