import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { MCPTool } from 'mcp-framework';

export interface BaseKeyVaultInput {
  vaultUrl: string;
  secretName?: string;
  secretValue?: string;
}

export default abstract class BaseAzureKeyVaultTool<T extends BaseKeyVaultInput> extends MCPTool<T> {
  abstract name: string;
  abstract description: string;

  protected async getClient(vaultUrl: string): Promise<SecretClient> {
    const credential = new DefaultAzureCredential();
    return new SecretClient(vaultUrl, credential);
  }

  protected validateSecretName(secretName?: string): void {
    if (!secretName) {
      throw new Error('Secret name is required for this operation.');
    }
  }

  protected validateVaultUrl(vaultUrl: string): void {
    if (!vaultUrl.startsWith('https://') || !vaultUrl.includes('.vault.azure.net')) {
      throw new Error('Invalid Key Vault URL format. Should be: https://<vault-name>.vault.azure.net');
    }
  }
}
