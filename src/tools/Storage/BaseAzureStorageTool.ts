import { MCPTool } from 'mcp-framework';
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

/**
 * Base class for Azure Storage tools that provides common functionality
 */
export default abstract class BaseAzureStorageTool<T extends Record<string, any>> extends MCPTool<T> {
  /**
   * Creates a BlobServiceClient using DefaultAzureCredential
   * @param accountName Azure Storage account name
   * @returns BlobServiceClient instance
   */
  protected createBlobServiceClient(accountName: string): BlobServiceClient {
    const credential = new DefaultAzureCredential();
    return new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential);
  }

  /**
   * Helper method to convert a readable stream to a string
   * @param readableStream The readable stream to convert
   * @returns Promise that resolves to the stream content as a string
   */
  protected async streamToString(readableStream: NodeJS.ReadableStream | undefined): Promise<string> {
    if (!readableStream) {
      return '';
    }

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (data: Buffer) => {
        chunks.push(data);
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
      readableStream.on('error', reject);
    });
  }
}
