import { supabase } from "@/app/utils/client";
import { NextResponse } from "next/server";

// Create Supabase client with server-side key

export async function GET() {
  try {
    const { data, error } = await supabase.from("early_warnings").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
