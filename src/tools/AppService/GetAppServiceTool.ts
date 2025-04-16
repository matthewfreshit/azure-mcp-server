import { z } from 'zod';
import BaseAzureAppServiceTool, { BaseAppServiceInput } from './BaseAzureAppServiceTool';

type GetAppInput = Required<Omit<BaseAppServiceInput, 'appName'>> & {
  appName: string;
};

class GetAppServiceTool extends BaseAzureAppServiceTool<GetAppInput> {
  name = 'azure_apps_get';
  description = 'Get details of an Azure App Service';

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

  async execute(input: GetAppInput) {
    this.validateResourceGroup(input.resourceGroupName);
    this.validateAppName(input.appName);

    const client = await this.getClient(input.subscriptionId);
    const app = await client.webApps.get(input.resourceGroupName, input.appName);

    return {
      name: app.name,
      id: app.id,
      state: app.state,
      hostNames: app.hostNames,
      defaultHostName: app.defaultHostName,
      kind: app.kind,
      location: app.location,
      enabled: app.enabled,
      availabilityState: app.availabilityState,
      siteConfig: app.siteConfig,
      usageState: app.usageState,
      repositorySiteName: app.repositorySiteName,
      httpsOnly: app.httpsOnly
    };
  }
}

export default GetAppServiceTool;
