"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function DocsPage() {
  const initialized = useRef(false);
  const bundleLoaded = useRef(false);
  const presetLoaded = useRef(false);

  function tryInit() {
    if (initialized.current) return;
    if (!bundleLoaded.current || !presetLoaded.current) return;

    const win = window as any;
    if (!win.SwaggerUIBundle || !win.SwaggerUIStandalonePreset) return;

    initialized.current = true;

    win.SwaggerUIBundle({
      url: "/api/docs",
      dom_id: "#swagger-ui",
      presets: [
        win.SwaggerUIBundle.presets.apis,
        win.SwaggerUIStandalonePreset,
      ],
      layout: "StandaloneLayout",
      deepLinking: true,
      persistAuthorization: true,
    });
  }

  useEffect(() => {
    tryInit();
  }, []);

  return (
    <>
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => {
          bundleLoaded.current = true;
          tryInit();
        }}
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"
        strategy="afterInteractive"
        onLoad={() => {
          presetLoaded.current = true;
          tryInit();
        }}
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
