export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || "https://snippets.so"

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjYwMjMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0NTYxMzExNjFmODNDN0Q3ZkRBMTViMzJhNWY3QzIxRkQ0RTI3RTk2In0",
      payload: "eyJkb21haW4iOiJzbmlwcGV0cy5zbyJ9",
      signature:
        "MHgxYjE4ZGYzNTk0OTZkZmY0NGU3Nzg3YWY1NTc3NmE3YzExMzk5OWNmYjU2MWY4OTUxOGQyYTlkYTAxNWU3YmFmMTg5MTFlZTI0YzZmYzA1ZWI0NDBmM2EzNmU1ODE3ZWRjYjQwMTI3M2UxMDUzZWFmNjc5OGM0MWY0MjkyM2VmNjFj",
    },
    frame: {
      version: "1",
      name: "Snippets.so",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: "Share Snippet",
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#ffffff"
    },
  };

  return Response.json(config);
}
