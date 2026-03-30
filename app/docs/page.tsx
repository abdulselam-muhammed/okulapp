"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function DocsPage() {
  const initialized = useRef(false);

  function initSwagger() {
    if (initialized.current) return;
    if (!(window as any).SwaggerUIBundle) return;
    initialized.current = true;

    (window as any).SwaggerUIBundle({
      url: "/api/docs",
      dom_id: "#swagger-ui",
      presets: [
        (window as any).SwaggerUIBundle.presets.apis,
        (window as any).SwaggerUIStandalonePreset,
      ],
      layout: "StandaloneLayout",
      deepLinking: true,
      persistAuthorization: true,
    });
  }

  useEffect(() => {
    // Try init in case scripts already loaded
    initSwagger();
  }, []);

  return (
    <>
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={initSwagger}
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"
        strategy="afterInteractive"
        onLoad={initSwagger}
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
      />
      <div id="swagger-ui" style={{ minHeight: "100vh" }} />
    </>
  );
}
