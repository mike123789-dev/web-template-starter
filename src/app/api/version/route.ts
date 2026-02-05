export async function GET() {
  return Response.json(
    {
      commitHash: process.env.N3R_BUILD_COMMIT_HASH ?? null,
      commitReference: process.env.N3R_BUILD_COMMIT_REFERENCE ?? null,
      buildNumber: process.env.N3R_BUILD_NUMBER ?? null,
      nodeEnv: process.env.NODE_ENV ?? null,
    },
    { status: 200 }
  );
}

