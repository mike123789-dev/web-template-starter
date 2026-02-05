export async function GET() {
  return Response.json(
    {
      status: 'healthy',
      build: {
        commitHash: process.env.N3R_BUILD_COMMIT_HASH ?? null,
        commitReference: process.env.N3R_BUILD_COMMIT_REFERENCE ?? null,
        buildNumber: process.env.N3R_BUILD_NUMBER ?? null,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

