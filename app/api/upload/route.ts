import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/lib/s3";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File missing" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${randomUUID()}-${file.name}`;
    const key = `next-chat/uploads/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = `${process.env.AWS_S3_BASE_URL}/${key}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
