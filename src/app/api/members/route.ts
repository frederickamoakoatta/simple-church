import { NextRequest, NextResponse } from "next/server";
import { createMember, listMembers } from "@/lib/members";
import type { MemberInput } from "@/types/member";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? undefined;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const result = await listMembers({ search, page });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to list members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members. Check your database connection." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MemberInput;

    if (!body.firstname?.trim() || !body.lastname?.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required." },
        { status: 400 },
      );
    }

    const id = await createMember(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create member:", error);
    return NextResponse.json(
      { error: "Failed to create member. Check your database connection." },
      { status: 500 },
    );
  }
}
