import { z } from 'zod';
import BaseAzureKeyVaultTool, { BaseKeyVaultInput } from './BaseAzureKeyVaultTool';

type SetSecretInput = Required<BaseKeyVaultInput>;

class SetSecretKeyVaultTool extends BaseAzureKeyVaultTool<SetSecretInput> {
  name = 'azure_keyvault_set_secret';
  description = 'Create or update a secret in Azure Key Vault';

  schema = {
    vaultUrl: {
      type: z.string(),
      description: 'Azure Key Vault URL (https://<vault-name>.vault.azure.net)'
    },
    secretName: {
      type: z.string(),
      description: 'Name of the secret to set'
    },
    secretValue: {
      type: z.string(),
      description: 'Value of the secret'
    }
  };

  async execute(input: SetSecretInput) {
    try {
      this.validateVaultUrl(input.vaultUrl);
      this.validateSecretName(input.secretName);

      const client = await this.getClient(input.vaultUrl);
      const result = await client.setSecret(input.secretName, input.secretValue);

      return {
        name: result.name,
        enabled: result.properties.enabled,
        created: result.properties.createdOn,
        updated: result.properties.updatedOn
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: `Error setting secret: ${error.message}`
        };
      }
      return {
        error: 'Unknown error occurred'
      };
    }
  }
}

export default SetSecretKeyVaultTool;
