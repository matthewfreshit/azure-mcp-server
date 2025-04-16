import { z } from 'zod';
import BaseAzureAppServiceTool, { BaseAppServiceInput } from './BaseAzureAppServiceTool';

type StartAppInput = Required<BaseAppServiceInput>;

class StartAppServiceTool extends BaseAzureAppServiceTool<StartAppInput> {
  name = 'azure_apps_start';
  description = 'Start an Azure App Service';

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

  async execute(input: StartAppInput) {
    this.validateResourceGroup(input.resourceGroupName);
    this.validateAppName(input.appName);

    const client = await this.getClient(input.subscriptionId);
    await client.webApps.start(input.resourceGroupName, input.appName);

    return {
      status: 'started',
      appName: input.appName
    };
  }
}

export default StartAppServiceTool;
