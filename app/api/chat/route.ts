import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  const backendChatURL = new URL("/chat", BACKEND_URL);

  const forwardHeaders = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    forwardHeaders.set("content-type", contentType);
  } else {
    forwardHeaders.set("content-type", "application/json");
  }

  const authorization = request.headers.get("authorization");
  if (authorization) {
    forwardHeaders.set("authorization", authorization);
  }

  const backendResponse = await fetch(backendChatURL, {
    method: "POST",
    headers: forwardHeaders,
    body: request.body,
    duplex: "half",
    signal: request.signal,
  });

  const responseBody = backendResponse.body;
  if (!responseBody) {
    return new Response("Backend response missing body", {
      status: 502,
    });
  }

  const proxyHeaders = new Headers(backendResponse.headers);
  proxyHeaders.set("cache-control", "no-cache");
  proxyHeaders.set("content-type", "text/event-stream; charset=utf-8");
  proxyHeaders.set("connection", "keep-alive");
  proxyHeaders.set("x-accel-buffering", "no");
  proxyHeaders.delete("content-length");

  return new Response(responseBody, {
    status: backendResponse.status,
    headers: proxyHeaders,
  });
}
