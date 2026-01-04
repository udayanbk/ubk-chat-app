import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { getServer } from "@/lib/socket/socketServer";
// const io = getServer();

/* ---------------- GET : public profile by id ---------------- */
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User id required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id)
      .select("name username email mobile avatar photos status statusLikes")
      .populate("statusLikes", "name username avatar ");

    return NextResponse.json({ user });
  } catch (error) {
    console.error("PROFILE GET ERROR:", error);
    return NextResponse.json(
      { message: "Internal error" },
      { status: 500 }
    );
  }
}

/* ---------------- POST : avatar / photos / status ---------------- */
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { avatar, photos, status } = await req.json();

    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        ...(avatar && { avatar }),
        ...(status !== undefined && { status }),
        ...(photos?.length && { $push: { photos: { $each: photos } } }),
      }
    );

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("PROFILE POST ERROR:", error);
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

/* ---------------- PATCH : profile updates ---------------- */
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      username,
      name,
      mobile,
      status,
      deletePhoto,
      avatar,
      toggleStatusLike,
      targetUserId,
    } = body;

    const myEmail = session.user.email;

    /* ---------------- STATUS LIKE TOGGLE ---------------- */
    if (toggleStatusLike && targetUserId) {
      // 🔹 logged-in user
      const me = await User.findOne({ email: myEmail }).select("_id");
      if (!me) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // 🔹 target profile owner
      const targetUser = await User.findById(targetUserId).select("statusLikes");
      if (!targetUser) {
        return NextResponse.json(
          { message: "Target user not found" },
          { status: 404 }
        );
      }

      const alreadyLiked = Array.isArray(targetUser.statusLikes)
        ? targetUser.statusLikes.some(
            (id: any) => id.toString() === me._id.toString()
          )
        : false;

      await User.updateOne(
        { _id: targetUserId },
        {
          [alreadyLiked ? "$pull" : "$addToSet"]: {
            statusLikes: me._id, // ✅ ONLY ObjectId
          },
        }
      );

      return NextResponse.json({
        success: true,
        liked: !alreadyLiked,
      });
    }

    /* ---------------- DELETE PHOTO ---------------- */
    if (deletePhoto) {
      await User.updateOne(
        { email: myEmail },
        { $pull: { photos: deletePhoto } }
      );
      return NextResponse.json({ success: true });
    }

    /* ---------------- VALIDATIONS ---------------- */
    const updateOps: any = {};

    if (status !== undefined) {
      if (status.length > 100) {
        return NextResponse.json(
          { message: "Status cannot exceed 100 characters" },
          { status: 400 }
        );
      }
      updateOps.status = status;
    }

    if (username) updateOps.username = username;
    if (name) updateOps.name = name;
    if (mobile) updateOps.mobile = mobile;
    if (avatar) updateOps.avatar = avatar;

    if (Object.keys(updateOps).length > 0) {
      await User.updateOne({ email: myEmail }, { $set: updateOps });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PROFILE PATCH ERROR:", error);
    return NextResponse.json(
      { message: "Patch failed" },
      { status: 500 }
    );
  }
}




