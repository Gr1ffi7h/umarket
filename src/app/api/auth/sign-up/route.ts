import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing email, password, or name" }, { status: 400 })
  }

  const emailTrimmed = email.trim()
  const passwordTrimmed = password.trim()
  const nameTrimmed = name.trim()

  if (passwordTrimmed.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  if (!emailTrimmed) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  if (!nameTrimmed) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: emailTrimmed,
      password: passwordTrimmed,
      options: {
        data: {
          full_name: nameTrimmed
        }
      }
    })

    if (error) {
      // Override any 6-character messages with our 8-character requirement
      let errorMessage = error.message
      if (errorMessage.includes("6 characters") || errorMessage.includes("8 characters")) {
        errorMessage = "Password must be at least 8 characters"
      }
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    return NextResponse.json({ user: data.user, session: data.session })
  } catch (err) {
    console.error("Sign up server error:", err)
    return NextResponse.json({ error: "Server error during sign up" }, { status: 500 })
  }
}
