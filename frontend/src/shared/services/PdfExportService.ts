import html2canvas from 'html2canvas';
import { Configuration } from '../../domains/machine-configuration/types/configuration.types';

type ExportOptions = {
  element: HTMLElement;
  companyName?: string;
  configurationName?: string;
  configurationTypeDataName?: string;
  orientation?: 'portrait' | 'landscape';
  configuration?: Configuration; // Add configuration data
};

/**
 * Captures the given element and opens a new window with an A4-sized print view
 * showing a header and the captured MachineConfigurationZone image.
 */
export async function openA4PrintWindowForMachineConfiguration(options: ExportOptions) {
  const { element, companyName, configurationName, configurationTypeDataName, orientation = 'portrait', configuration } = options;
  // Render element to canvas - capture full element, will scale in CSS
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

  const pageSize = 'A4 landscape'; // Always use landscape orientation

  // Check if this is a Nuuk machine
  const isNuuk = (configuration?.ConfigurationType || configuration?.configurationTypeData?.configurationType || '')
    .toLowerCase().includes('nuuk');

  // Generate configuration info (without title, include company name)
  let configInfoHTML = '';
  if (configuration) {
    const configType = configuration.ConfigurationType || configuration.configurationTypeData?.configurationType || 'Onbekend';
    
    configInfoHTML = `
      <div class="section">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Bedrijf:</span>
            <span class="info-value">${escapeHtml(companyName || 'Onbekend')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Configuratie:</span>
            <span class="info-value">${escapeHtml(configuration.name || 'Onbekend')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Type:</span>
            <span class="info-value">${escapeHtml(configType)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Aantal Trays:</span>
            <span class="info-value">${configuration.trays?.length || 0}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Aangemaakt:</span>
            <span class="info-value">${configuration.createdAt ? new Date(configuration.createdAt).toLocaleString('nl-NL') : 'Onbekend'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Laatst Bewerkt:</span>
            <span class="info-value">${configuration.updatedAt ? new Date(configuration.updatedAt).toLocaleString('nl-NL') : 'Onbekend'}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Generate lift settings (Liftstand)
  let liftSettingsHTML = '';
  if (configuration) {
    if (isNuuk) {
      // Special handling for Nuuk machines
      liftSettingsHTML = `
        <div class="section">
          <div class="section-title">Liftstand</div>
          <div class="info-message">Geen lift opties voor machine van type Nuuk</div>
        </div>
      `;
    } else if (configuration.elevatorSetting || configuration.elevatorAddition) {
      // Show elevator setting and addition for non-Nuuk machines
      liftSettingsHTML = `
        <div class="section">
          <div class="section-title">Liftstand</div>
          <div class="info-grid">
            ${configuration.elevatorSetting ? `
              <div class="info-item">
                <span class="info-label">Stand:</span>
                <span class="info-value">${configuration.elevatorSetting}</span>
              </div>
            ` : ''}
            ${configuration.elevatorAddition ? `
              <div class="info-item">
                <span class="info-label">Toevoeging:</span>
                <span class="info-value">${escapeHtml(configuration.elevatorAddition)}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title></title>
  <style>
    @page { 
      size: ${pageSize}; 
      margin: 5mm;
    }
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      padding: 0;
      font-family: Arial, Helvetica, sans-serif; 
      font-size: 9pt;
      overflow: hidden;
    }
    .page {
      width: 287mm;
      height: 200mm;
      display: flex;
      gap: 4mm;
      overflow: hidden;
    }
    
    .left-column {
      flex: 1.5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      max-height: 200mm;
    }
    
    .right-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3mm;
      overflow-y: auto;
    }
    
    .section {
      padding: 2.5mm;
      border: 1px solid #ddd;
      border-radius: 2mm;
      background: #f9f9f9;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 10pt;
      font-weight: 600;
      margin-bottom: 2mm;
      color: #333;
      border-bottom: 1px solid #ccc;
      padding-bottom: 1mm;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5mm;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.3mm;
    }
    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 8pt;
    }
    .info-value {
      color: #000;
      font-size: 9pt;
    }
    .info-message {
      color: #666;
      font-size: 9pt;
      font-style: italic;
    }
    
    .image-wrap {
      width: 100%;
      height: 100%;
      max-height: 180mm;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .image-wrap img {
      max-width: 95%;
      max-height: 180mm;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    
    @media print {
      .noprint { display: none; }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
    .toolbar { position: fixed; top: 8px; right: 8px; z-index: 1000; }
    .btn { padding: 6px 10px; border: 1px solid #c00; color: #fff; background: #c00; border-radius: 4px; cursor: pointer; }
  </style>
  <script>
    function doPrint() { setTimeout(() => { window.print(); }, 300); }
  </script>
  <body onload="doPrint()">
    <div class="toolbar noprint">
      <button class="btn" onclick="window.print()">Print</button>
    </div>
    <div class="page">
      <div class="left-column">
        <div class="image-wrap">
          <img src="${dataUrl}" alt="Configuration" />
        </div>
      </div>
      
      <div class="right-column">
        ${configInfoHTML}
        ${liftSettingsHTML}
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
