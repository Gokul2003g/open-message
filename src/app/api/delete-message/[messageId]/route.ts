import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } },
) {
  const messageId = params.messageId;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user)
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  try {
    const response = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } },
    );
    if (response.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found already deleted",
        },
        { status: 404 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("errr in deleting message route", error);
    return Response.json(
      {
        success: false,
        message: "Error Deleting messages",
      },
      { status: 200 },
    );
  }
}
