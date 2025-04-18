import { z } from 'zod';
import BaseAzureKeyVaultTool, { BaseKeyVaultInput } from './BaseAzureKeyVaultTool';

type ListSecretsInput = Pick<BaseKeyVaultInput, 'vaultUrl'>;

class ListSecretsKeyVaultTool extends BaseAzureKeyVaultTool<ListSecretsInput> {
  name = 'azure_keyvault_list_secrets';
  description = 'List all secrets in an Azure Key Vault';

  schema = {
    vaultUrl: {
      type: z.string(),
      description: 'Azure Key Vault URL (https://<vault-name>.vault.azure.net)'
    }
  };

  async execute(input: ListSecretsInput) {
    try {
      this.validateVaultUrl(input.vaultUrl);

      const client = await this.getClient(input.vaultUrl);
      const secrets = [];

      for await (const secret of client.listPropertiesOfSecrets()) {
        secrets.push({
          name: secret.name,
          enabled: secret.enabled,
          created: secret.createdOn,
          updated: secret.updatedOn
        });
      }

      return { secrets };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: `Error listing secrets: ${error.message}`,
          secrets: []
        };
      }
      return {
        error: 'Unknown error occurred',
        secrets: []
      };
    }
  }
}

export default ListSecretsKeyVaultTool;
