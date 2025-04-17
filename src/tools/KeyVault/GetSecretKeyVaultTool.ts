import { z } from 'zod';
import BaseAzureKeyVaultTool, { BaseKeyVaultInput } from './BaseAzureKeyVaultTool';

type GetSecretInput = Required<Pick<BaseKeyVaultInput, 'vaultUrl' | 'secretName'>>;

class GetSecretKeyVaultTool extends BaseAzureKeyVaultTool<GetSecretInput> {
  name = 'azure_keyvault_get_secret';
  description = 'Get a secret from Azure Key Vault';

  schema = {
    vaultUrl: {
      type: z.string(),
      description: 'Azure Key Vault URL (https://<vault-name>.vault.azure.net)'
    },
    secretName: {
      type: z.string(),
      description: 'Name of the secret to retrieve'
    }
  };

  async execute(input: GetSecretInput) {
    try {
      this.validateVaultUrl(input.vaultUrl);
      this.validateSecretName(input.secretName);

      const client = await this.getClient(input.vaultUrl);
      const secret = await client.getSecret(input.secretName);

      return {
        name: secret.name,
        value: secret.value,
        contentType: secret.properties.contentType,
        enabled: secret.properties.enabled
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: `Error retrieving secret: ${error.message}`
        };
      }
      return {
        error: 'Unknown error occurred'
      };
    }
  }
}

export default GetSecretKeyVaultTool;
