import html2canvas from 'html2canvas';

type ExportOptions = {
  element: HTMLElement;
  companyName?: string;
  configurationName?: string;
  configurationTypeDataName?: string;
  orientation?: 'portrait' | 'landscape';
};

/**
 * Captures the given element and opens a new window with an A4-sized print view
 * showing a header and the captured MachineConfigurationZone image.
 */
export async function openA4PrintWindowForMachineConfiguration(options: ExportOptions) {
  const { element, companyName, configurationName, configurationTypeDataName, orientation = 'portrait' } = options;
  // Render element to canvas (scale up for quality)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  });
  const dataUrl = canvas.toDataURL('image/png');

  // Open a new window with print-focused HTML
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const titleCompany = companyName ?? '';
  const titleConfig = configurationName ?? '';
  const titleType = configurationTypeDataName ?? '';

  const pageSize = orientation === 'landscape' ? 'A4 landscape' : 'A4';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Configuration Export</title>
  <style>
    @page { size: ${pageSize}; margin: 8mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; }
    .page {
      width: ${orientation === 'landscape' ? '297mm' : '210mm'};
      height: ${orientation === 'landscape' ? '210mm' : '297mm'};
      display: flex;
      flex-direction: column;
      gap: 4mm;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 1mm;
    }
    .title { font-size: 12pt; font-weight: 700; line-height: 1.2; }
    .subtitle { font-size: 9.5pt; color: #444; line-height: 1.2; }
    .image-wrap {
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0; /* allow flex item to shrink within fixed-height page */
    }
    .image-wrap img {
      max-width: 100%;
      height: 100%;
      width: auto;
      object-fit: contain;
    }
    @media print {
      .noprint { display: none; }
    }
    .toolbar { position: fixed; top: 8px; right: 8px; }
    .btn { padding: 6px 10px; border: 1px solid #c00; color: #fff; background: #c00; border-radius: 4px; cursor: pointer; }
  </style>
  <script>
    function doPrint() { setTimeout(() => { window.print(); }, 300); }
  </script>
  </head>
  <body onload="doPrint()">
    <div class="toolbar noprint">
      <button class="btn" onclick="window.print()">Print</button>
    </div>
    <div class="page">
      <div class="header">
        <div class="title">${escapeHtml(titleCompany)}${titleCompany && titleConfig ? ' · ' : ''}${escapeHtml(titleConfig)}</div>
        ${titleType ? `<div class="subtitle">${escapeHtml(titleType)}</div>` : ''}
      </div>
      <div class="image-wrap">
        <img src="${dataUrl}" alt="Configuration" />
      </div>
    </div>
  </body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
