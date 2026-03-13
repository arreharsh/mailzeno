import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await context.params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { is_active, is_default } = body;

  try {
    // 🔹 Toggle active
    if (typeof is_active === "boolean") {
      const { error } = await supabase
        .from("smtp_accounts")
        .update({ is_active })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    }

    // 🔹 Set default SMTP
    if (is_default === true) {
      const { error } = await supabase
        .from("smtp_accounts")
        .update({ is_default: false })
        .eq("user_id", user.id);

      if (error) throw error;

      await supabase
        .from("smtp_accounts")
        .update({ is_default: true })
        .eq("id", id)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update SMTP" },
      { status: 500 },
    );
  }
}

// 🔹 Delete SMTP
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await context.params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { error } = await supabase
      .from("smtp_accounts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete SMTP" },
      { status: 500 },
    );
  }
}
