import { z } from 'zod';
import BaseAzureKeyVaultTool, { BaseKeyVaultInput } from './BaseAzureKeyVaultTool';

type DeleteSecretInput = Required<Pick<BaseKeyVaultInput, 'vaultUrl' | 'secretName'>>;

class DeleteSecretKeyVaultTool extends BaseAzureKeyVaultTool<DeleteSecretInput> {
  name = 'azure_keyvault_delete_secret';
  description = 'Delete a secret from Azure Key Vault';

  schema = {
    vaultUrl: {
      type: z.string(),
      description: 'Azure Key Vault URL (https://<vault-name>.vault.azure.net)'
    },
    secretName: {
      type: z.string(),
      description: 'Name of the secret to delete'
    }
  };

  async execute(input: DeleteSecretInput) {
    try {
      this.validateVaultUrl(input.vaultUrl);
      this.validateSecretName(input.secretName);

      const client = await this.getClient(input.vaultUrl);
      const result = await client.beginDeleteSecret(input.secretName);
      await result.pollUntilDone();

      return {
        name: input.secretName,
        status: 'deleted'
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: `Error deleting secret: ${error.message}`
        };
      }
      return {
        error: 'Unknown error occurred'
      };
    }
  }
}

export default DeleteSecretKeyVaultTool;
