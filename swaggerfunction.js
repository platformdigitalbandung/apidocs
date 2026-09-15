// Swagger UI dimuat sebagai UMD (window.SwaggerUIBundle / SwaggerUIStandalonePreset)
// dari jsDelivr dengan versi dipatok di index.html — bukan @latest.
export const URLData = "./openapi.yaml";

export function setSwagger() {
  window.ui = window.SwaggerUIBundle({
    url: URLData,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIStandalonePreset],
    plugins: [window.SwaggerUIBundle.plugins.DownloadUrl],
  });
  return window.ui;
}
