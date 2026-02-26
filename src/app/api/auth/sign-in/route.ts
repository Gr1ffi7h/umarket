import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 500 }
    )
  }

  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
  }

  const emailTrimmed = email.trim()
  const passwordTrimmed = password.trim()

  if (!emailTrimmed) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  if (passwordTrimmed.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailTrimmed,
      password: passwordTrimmed
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user, session: data.session })
  } catch (err) {
    console.error("Sign in server error:", err)
    return NextResponse.json({ error: "Server error during sign in" }, { status: 500 })
  }
}
