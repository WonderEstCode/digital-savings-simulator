import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET ?? "dev-secret";

export async function POST(request: Request) {
  const { secret, tag } = await request.json();

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const validTags = ["products", "product-types"];
  if (!validTags.includes(tag)) {
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  }

  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true, tag });
}
