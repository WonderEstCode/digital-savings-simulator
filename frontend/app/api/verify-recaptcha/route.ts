import { NextResponse } from "next/server";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const SCORE_THRESHOLD = 0.5;

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
}

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token de verificación requerido." },
      { status: 400 },
    );
  }

  if (!RECAPTCHA_SECRET) {
    if (token === "SIMULATED_TOKEN") {
      return NextResponse.json({ success: true, score: 0.9 });
    }
    return NextResponse.json(
      { success: false, error: "Verificación de seguridad fallida." },
      { status: 403 },
    );
  }

  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
  const params = new URLSearchParams({
    secret: RECAPTCHA_SECRET,
    response: token,
  });

  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data: RecaptchaResponse = await response.json();

  if (!data.success || (data.score !== undefined && data.score < SCORE_THRESHOLD)) {
    return NextResponse.json(
      {
        success: false,
        error: "La verificación de seguridad no fue exitosa. Intenta de nuevo.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({ success: true, score: data.score });
}
