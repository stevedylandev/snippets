import { NextRequest } from "next/server";
import { PinataSDK } from "pinata";
import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_DOMAIN,
});

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Get file info based on slug
    let fileInfo;
    let cid;

    if (slug.startsWith("bafk") || slug.startsWith("Qm")) {
      fileInfo = await pinata.files.list().cid(slug);
      cid = slug;
    } else {
      fileInfo = await pinata.files.list().metadata({
        slug: slug,
      });
      if (fileInfo.files.length === 0) {
        return new Response('Snippet not found', { status: 404 });
      }
      cid = fileInfo.files[0].cid;
    }

    const file = fileInfo.files[0];
    console.log(file)

    // Get content
    const signedUrl = await pinata.gateways.createSignedURL({
      cid: cid,
      expires: 20,
    });

    const contentReq = await fetch(signedUrl);
    const content = await contentReq.text();

    // If password protected, don't show content
    const isPasswordProtected = !!file.keyvalues.passwordHash;

    // Get language for syntax highlighting colors
    const lang = file.keyvalues.lang || "javascript";

    // Extract first few lines (up to 10)
    const lines = content.split('\n').slice(0, 30);
    const previewContent = isPasswordProtected
      ? "🔒 Password protected snippet"
      : lines.join('\n');

    // Load CommitMono font
    const commitMonoRegular = await fetch(
      new URL('../../../CommitMono-400-Regular.otf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    const commitMonoBold = await fetch(
      new URL('../../../CommitMono-700-Regular.otf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    // Create image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            paddingTop: 40
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 0,
              width: '100%',
              maxWidth: 900,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: 'CommitMono',
                fontSize: 42,
                fontWeight: 'bold',
              }}
            >
              Snippets.so
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: 900,
              padding: 0,
              backgroundColor: '#ffffff',
              borderRadius: '12px 12px 0 0',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              flex: 1,
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                backgroundColor: '#f6f8fa',
                width: '100%',
                padding: '0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 18,
                  fontWeight: 'medium',
                  color: '#101827',
                  backgroundColor: '#fff',
                  border: '1px solid #eaeaea',
                  borderBottom: 'none',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  padding: '6px 16px',
                  marginTop: 10,
                  marginLeft: 10,
                  height: 32,
                  fontFamily: 'CommitMono',
                }}
              >
                {file.name || 'Untitled Snippet'}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 24,
                backgroundColor: '#ffffff',
                color: '#24292e',
                fontSize: 18,
                fontFamily: 'CommitMono',
                overflow: 'hidden',
                whiteSpace: 'pre',
                opacity: '0.85',
                flex: 1,
                height: '100%',
              }}
            >
              {previewContent}
              {lines.length >= 20 && !isPasswordProtected && (
                <div style={{ marginTop: 16, color: '#888', fontSize: 18 }}>...</div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'CommitMono',
            data: commitMonoRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'CommitMono',
            data: commitMonoBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );

  } catch (error) {
    console.error("Error generating preview:", error);
    return new Response('Error generating preview', { status: 500 });
  }
}
