// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.BACKEND_BASE_URL; // p.ej. http://localhost:5000/api
const ACCESS = process.env.ACCESS_CODE;

function must<T>(value: T | undefined, name: string): T {
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export async function GET(req: NextRequest) {
  const base = must(BASE, "BACKEND_BASE_URL");
  const access = must(ACCESS, "ACCESS_CODE");

  const qs = new URL(req.url).search; // conserva query ?pageSize=...
  const upstream = await fetch(`${base}/products${qs}`, {
    headers: { "x-access-code": access },
    // Si tu backend NO requiere auth para GET, puedes omitir el header en GET
  });

  const body = await upstream.text().catch(() => "");
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") || "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  const base = must(BASE, "BACKEND_BASE_URL");
  const access = must(ACCESS, "ACCESS_CODE");

  const json = await req.json();
  const upstream = await fetch(`${base}/products`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-access-code": access, // necesario para tu middleware Express
    },
    body: JSON.stringify(json),
  });

  const body = await upstream.text().catch(() => "");
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") || "application/json",
    },
  });
}

// Opcional: implementa PUT/PATCH/DELETE igual, apuntando a `${base}/products/:id`
