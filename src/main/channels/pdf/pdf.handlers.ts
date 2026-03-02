import { BrowserWindow } from 'electron/main';
import { EInvoiceQueryStatus, IDownloadPdf, Response, STATUS } from '../../../interfaces';
import { join, resolve } from 'node:path';
import { is } from '@electron-toolkit/utils';
import { writeFileSync } from 'node:fs';
import { RomaninaDateUtils } from '../../lib/romanian-utils';
import { PdfPathUtils } from '../../lib/pdf-path-utils';

export const downloadPdf = async ({ data }: { data: IDownloadPdf }): Promise<Response<any>> => {
  try {
    const query = new URLSearchParams();
    data.client && query.set(EInvoiceQueryStatus.CLIENT, 'true');
    data.manager && query.set(EInvoiceQueryStatus.MANAGER, 'true');
    data.payment && query.set(EInvoiceQueryStatus.PAYMENT, 'true');
    data.full && query.set(EInvoiceQueryStatus.FULL, 'true');

    const win = new BrowserWindow({
      show: is.dev, // Show window in development for debugging
      webPreferences: {
        preload: is.dev 
          ? join(__dirname, '../preload/index.js')
          : join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    // Return a promise that resolves when PDF generation is complete
    return new Promise<Response<any>>((resolvePromise, rejectPromise) => {
      // Set a global timeout for the entire PDF generation process
      const globalTimeout = setTimeout(() => {
        console.error('PDF generation timeout: Process exceeded maximum time limit');
        win.close();
        rejectPromise({ [STATUS.Error]: { msg: STATUS.PdfGenerationError } });
      }, 30000); // 30 seconds total timeout
      const loadPage = async () => {
        try {
          if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            const devUrl = `${process.env['ELECTRON_RENDERER_URL']}/#/invoices/${data.invoice}?${query.toString()}`;
            console.log('Loading PDF page (dev):', devUrl);
            await win.loadURL(devUrl);
          } else {
            const prodPath = join(__dirname, '../renderer/index.html');
            const fullUrl = `file://${prodPath}#/invoices/${data.invoice}?${query.toString()}`;
            console.log('Loading PDF page (prod):', fullUrl);
            await win.loadURL(fullUrl);
          }
        } catch (loadError) {
          console.error('Error loading page for PDF generation:', loadError);
          clearTimeout(globalTimeout);
          win.close();
          rejectPromise({ [STATUS.Error]: { msg: STATUS.PdfLoadError } });
        }
      };

      win.webContents.on('did-finish-load', () => {
        let attempts = 0;
        const maxAttempts = 15; // Maximum 15 seconds of waiting

        // Wait for data to load and check if content is ready
        const checkDataLoaded = async () => {
          try {
            attempts++;

            // Check if we've exceeded max attempts
            if (attempts > maxAttempts) {
              console.error('PDF generation timeout: Data did not load within expected time');
              clearTimeout(globalTimeout);
              win.close();
              rejectPromise({ [STATUS.Error]: { msg: STATUS.PdfGenerationError } });
              return;
            }

            // Check if the page is ready for PDF generation
            let pageContent = true; // Default to loading state
            try {
              pageContent = await win.webContents.executeJavaScript(`
                (function() {
                  try {
                    // Wait for document to be ready
                    if (!document || !document.body) {
                      return true; // Still loading
                    }
                    
                    // Check if React app has loaded by looking for common elements
                    const hasReactRoot = document.querySelector('#root') !== null;
                    if (!hasReactRoot) {
                      return true; // Still loading
                    }
                    
                    // Get body text safely
                    const bodyText = document.body.innerText || '';
                    
                    // Check for loading states
                    if (bodyText.includes('Loading invoice...') || 
                        bodyText.includes('Invoice not found') ||
                        bodyText.includes('Error loading invoice')) {
                      return true; // Still loading or error
                    }
                    
                    // Check if page has minimal content (might still be loading)
                    if (bodyText.trim().length < 100) {
                      return true; // Still loading
                    }
                    
                    // Check for specific invoice content indicators
                    const hasInvoiceContent = bodyText.includes('ACT') || 
                                            bodyText.includes('FACTURA') ||
                                            bodyText.includes('Invoice') ||
                                            document.querySelector('table') !== null;
                    
                    return !hasInvoiceContent; // Return true if still loading
                  } catch (e) {
                    console.error('Error in page content check:', e);
                    return true; // Assume still loading on error
                  }
                })()
              `);
            } catch (executeError) {
              console.error('Failed to execute page content check:', executeError);
              
              // If JavaScript execution fails multiple times, use timeout-based approach
              if (attempts >= 5) {
                console.log('JavaScript execution failed multiple times, using timeout-based approach');
                // After 5 seconds of trying, just generate the PDF
                pageContent = false; // Assume page is ready
              } else {
                // If we can't execute the script, wait a bit more
                pageContent = true;
              }
            }

            if (pageContent) {
              // Still loading or error, wait a bit more
              console.log(`PDF generation attempt ${attempts}/${maxAttempts}: Page still loading...`);
              setTimeout(checkDataLoaded, 1000);
              return;
            }

            // Data is loaded, generate PDF
            console.log('PDF generation: Page loaded successfully, generating PDF...');
            
            // Add a small delay to ensure all rendering is complete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let buffer;
            try {
              buffer = await win.webContents.printToPDF({ 
                pageSize: 'A4',
                printBackground: true
              });
              
              if (!buffer || buffer.length === 0) {
                throw new Error('Generated PDF buffer is empty');
              }
              
              console.log(`PDF generation: Successfully generated PDF buffer (${buffer.length} bytes)`);
            } catch (pdfError) {
              console.error('PDF printToPDF failed:', pdfError);
              clearTimeout(globalTimeout);
              win.close();
              rejectPromise({ [STATUS.Error]: { msg: STATUS.PdfGenerationError } });
              return;
            }

            const { time_stamp, year, month } = RomaninaDateUtils;

            try {
              const filePath = resolve(
                PdfPathUtils.get_path(year(), month()) as string,
                `${data.car_number} - ${data.full ? '' : `${data.client ? 'CLIENT - ' : ''}${data.manager ? 'MANAGER - ' : ''}${data.payment ? 'PLATA - ' : ''}`}ACT indeplinire lucrari - ${time_stamp()}.pdf`
              );
              console.log('PDF generation: Saving PDF to:', filePath);
              writeFileSync(filePath, buffer);
              console.log('PDF generation: File saved successfully');

              // Close the window after successful PDF generation
              clearTimeout(globalTimeout);
              win.close();
              resolvePromise({ [STATUS.Success]: true });
            } catch (saveError) {
              console.error('PDF save failed:', saveError);
              clearTimeout(globalTimeout);
              win.close();
              rejectPromise({ [STATUS.Error]: { msg: STATUS.PdfSaveError } });
            }
          } catch (error) {
            console.error('PDF generation failed:', error);
            clearTimeout(globalTimeout);
            win.close();
            rejectPromise({ [STATUS.Error]: { msg: STATUS.PdfGenerationError } });
          }
        };

        // Start checking after initial delay
        setTimeout(checkDataLoaded, 2000);
      });

      win.webContents.on('did-fail-load', (_, errorCode, errorDescription) => {
        console.error('Failed to load page for PDF generation:', errorCode, errorDescription);
        clearTimeout(globalTimeout);
        win.close();
        rejectPromise({ [STATUS.Error]: { msg: STATUS.PdfLoadError } });
      });

      // Start loading the page
      loadPage();
    });
  } catch (error: unknown) {
    console.error('Error in downloadPdf:', error);
    return { [STATUS.Error]: { msg: STATUS.PdfGenerationError } };
  }
};
