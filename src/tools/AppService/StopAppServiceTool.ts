import { z } from 'zod';
import BaseAzureAppServiceTool, { BaseAppServiceInput } from './BaseAzureAppServiceTool';

type StopAppInput = Required<BaseAppServiceInput>;

class StopAppServiceTool extends BaseAzureAppServiceTool<StopAppInput> {
  name = 'azure_apps_stop';
  description = 'Stop an Azure App Service';

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

  async execute(input: StopAppInput) {
    this.validateResourceGroup(input.resourceGroupName);
    this.validateAppName(input.appName);

    const client = await this.getClient(input.subscriptionId);
    await client.webApps.stop(input.resourceGroupName, input.appName);

    return {
      status: 'stopped',
      appName: input.appName
    };
  }
}

export default StopAppServiceTool;
