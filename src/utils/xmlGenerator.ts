import { XMLData } from "@/types/backoffice";

export function generateXML(data: XMLData): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <!-- Carousel Section -->
  <carousel>
    <section>
`;

  // Generate carousel items
  data.carousel.forEach((item) => {
    const attrs: string[] = [];
    if (item.isLive) attrs.push('islive="true"');
    if (item.videoUrl) attrs.push(`videourl="${escapeXml(item.videoUrl)}"`);
    if (item.videoId) attrs.push(`videoid="${escapeXml(item.videoId)}"`);
    if (item.title) attrs.push(`title="${escapeXml(item.title)}"`);
    
    const lockupAttrs = attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
    xml += `      <lockup${lockupAttrs}>
        <img src="${escapeXml(item.src)}" width="${item.width}" height="${item.height}" />
      </lockup>
`;
  });

  xml += `    </section>
  </carousel>

`;

  // Generate categories
  data.categories.forEach((category) => {
    xml += `  <!-- Category: ${escapeXml(category.name)} -->
  <separator>
    <button>
      <text>${escapeXml(category.name)}</text>
    </button>
  </separator>
  <shelf>
`;

    category.videos.forEach((video) => {
      xml += `    <lockup videourl="${escapeXml(video.videoUrl)}" videoid="${escapeXml(video.id)}">
      <img src="${escapeXml(video.thumbnail)}" width="400" height="225" />
      <title>${escapeXml(video.title)}</title>
      <description>${escapeXml(video.description)}</description>
    </lockup>
`;
    });

    xml += `  </shelf>

`;
  });

  xml += `</document>`;
  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function downloadXML(xml: string, filename: string = "index.xml") {
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
