import { NextRequest, NextResponse } from "next/server";
import { deleteMember, getMember, updateMember } from "@/lib/members";
import type { MemberInput } from "@/types/member";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const member = await getMember(Number(id));

    if (!member) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Failed to get member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as MemberInput;

    if (!body.firstname?.trim() || !body.lastname?.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required." },
        { status: 400 },
      );
    }

    const updated = await updateMember(Number(id), body);

    if (!updated) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update member:", error);
    return NextResponse.json(
      { error: "Failed to update member." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteMember(Number(id));

    if (!deleted) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete member:", error);
    return NextResponse.json(
      { error: "Failed to delete member." },
      { status: 500 },
    );
  }
}
