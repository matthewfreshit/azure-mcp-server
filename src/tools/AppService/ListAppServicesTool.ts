import { z } from 'zod';
import BaseAzureAppServiceTool, { BaseAppServiceInput } from './BaseAzureAppServiceTool';

type ListAppsInput = BaseAppServiceInput;

class ListAppServicesTool extends BaseAzureAppServiceTool<ListAppsInput> {
  name = 'azure_apps_list';
  description = 'List all Azure App Services';

  schema = {
    subscriptionId: {
      type: z.string(),
      description: 'Azure Subscription ID'
    }
  };

  async execute(input: ListAppsInput) {
    const client = await this.getClient(input.subscriptionId);
    const appsList = await client.webApps.list();
    const allApps = [];

    for await (const app of appsList) {
      allApps.push({
        name: app.name,
        id: app.id,
        state: app.state,
        hostNames: app.hostNames,
        kind: app.kind,
        location: app.location
      });
    }

    return allApps;
  }
}

export default ListAppServicesTool;
