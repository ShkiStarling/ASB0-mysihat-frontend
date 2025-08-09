import { supabase } from "@/app/utils/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const keyword = searchParams.get("keyword") || "all";
    const mediaType = searchParams.get("mediaType") || "all";
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const dateRange = searchParams.get("dateRange") || "7days";

    // Build the base query
    let query = supabase.from("mentions").select("*", { count: "exact" });

    // Apply filters
    if (keyword !== "all") {
      // Assuming keywords is stored as a JSON array or comma-separated string
      query = query.or(`keywords.cs.{${keyword}}, keywords.ilike.%${keyword}%`);
    }

    if (mediaType !== "all") {
      query = query.eq("mediaType", mediaType);
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`headline.ilike.%${search}%, summary.ilike.%${search}%`);
    }

    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "7days":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "30days":
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query = query.gte("date", startDate.toISOString().split("T")[0]);
      }
    }

    // Get total count for pagination (before applying limit/offset)
    const {
      data: countData,
      error: countError,
      count: totalCount,
    } = await query;

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query
      .range(offset, offset + limit - 1)
      .order("date", { ascending: false });

    // Execute the paginated query
    const { data: mentions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get statistics
    const statsQuery = supabase
      .from("mentions")
      .select("media_type, status", { count: "exact" });
    const { data: allMentions, count: totalMentions } = await statsQuery;
    console.log("allMentions", allMentions);
    // Calculate statistics
    const stats = {
      totalMentions: totalMentions || 0,
      verifiedMentions:
        allMentions?.filter((m) => m.status === "verified").length || 0,
      unverifiedMentions:
        allMentions?.filter((m) => m.status === "unverified").length || 0,
      mainStreamMedia:
        allMentions?.filter((m) => m.media_type === "mainstream").length || 0,
      socialMedia:
        allMentions?.filter((m) => m.media_type === "social media").length || 0,
    };

    // Get unique keywords for filter dropdown
    const { data: keywordData } = await supabase
      .from("mentions")
      .select("keywords");

    const keywords = [
      ...new Set(
        keywordData
          ?.flatMap((item) => {
            if (typeof item.keywords === "string") {
              // If keywords is a comma-separated string
              return item.keywords.split(",").map((k) => k.trim());
            } else if (Array.isArray(item.keywords)) {
              // If keywords is an array
              return item.keywords;
            }
            return [];
          })
          .filter((keyword) => keyword && keyword.length > 0)
      ),
    ];

    const totalPages = Math.ceil((totalCount || 0) / limit);

    const data = {
      mentions: mentions || [],
      stats,
      keywords,
      total: totalCount || 0,
      page,
      totalPages,
      limit,
    };

    console.log("data", data);

    // Return the expected data structure
    return NextResponse.json(
      {
        mentions: mentions || [],
        stats,
        keywords,
        total: totalCount || 0,
        page,
        totalPages,
        limit,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract parameters from POST body (alternative to GET with query params)
    const {
      page = 1,
      limit = 5,
      keyword = "all",
      mediaType = "all",
      status = "all",
      search = "",
      dateRange = "7days",
    } = body;

    // Build the base query
    let query = supabase.from("mentions").select("*", { count: "exact" });

    // Apply filters (same logic as GET)
    if (keyword !== "all") {
      query = query.or(`keywords.cs.{${keyword}}, keywords.ilike.%${keyword}%`);
    }

    if (mediaType !== "all") {
      query = query.eq("mediaType", mediaType);
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`headline.ilike.%${search}%, summary.ilike.%${search}%`);
    }

    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "7days":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "30days":
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query = query.gte("date", startDate.toISOString().split("T")[0]);
      }
    }

    // Get total count
    const { count: totalCount } = await query;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query
      .range(offset, offset + limit - 1)
      .order("date", { ascending: false });

    const { data: mentions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get statistics
    const statsQuery = supabase
      .from("mentions")
      .select("mediaType, status", { count: "exact" });
    const { data: allMentions, count: totalMentions } = await statsQuery;

    const stats = {
      totalMentions: totalMentions || 0,
      verifiedMentions:
        allMentions?.filter((m) => m.status === "verified").length || 0,
      unverifiedMentions:
        allMentions?.filter((m) => m.status === "unverified").length || 0,
      mainStreamMedia:
        allMentions?.filter((m) => m.mediaType === "mainstream").length || 0,
      socialMedia:
        allMentions?.filter((m) => m.mediaType === "social media").length || 0,
    };

    // Get unique keywords
    const { data: keywordData } = await supabase
      .from("mentions")
      .select("keywords");

    const keywords = [
      ...new Set(
        keywordData
          ?.flatMap((item) => {
            if (typeof item.keywords === "string") {
              return item.keywords.split(",").map((k) => k.trim());
            } else if (Array.isArray(item.keywords)) {
              return item.keywords;
            }
            return [];
          })
          .filter((keyword) => keyword && keyword.length > 0)
      ),
    ];

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json(
      {
        mentions: mentions || [],
        stats,
        keywords,
        total: totalCount || 0,
        page,
        totalPages,
        limit,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
