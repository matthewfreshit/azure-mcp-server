import { z } from 'zod';
import BaseAzureAppServiceTool, { BaseAppServiceInput } from './BaseAzureAppServiceTool';

type RestartAppInput = Required<BaseAppServiceInput>;

class RestartAppServiceTool extends BaseAzureAppServiceTool<RestartAppInput> {
  name = 'azure_apps_restart';
  description = 'Restart an Azure App Service';

  schema = {
    subscriptionId: {
      type: z.string(),
      description: 'Azure Subscription ID'
    },
    resourceGroupName: {
      type: z.string(),
      description: 'Azure Resource Group name'
    },
    appName: {
      type: z.string(),
      description: 'App Service name'
    }
  };

  async execute(input: RestartAppInput) {
    this.validateResourceGroup(input.resourceGroupName);
    this.validateAppName(input.appName);

    const client = await this.getClient(input.subscriptionId);
    await client.webApps.restart(input.resourceGroupName, input.appName);

    return {
      status: 'restarted',
      appName: input.appName
    };
  }
}

export default RestartAppServiceTool;
