import { MCPTool } from 'mcp-framework';
import { WebSiteManagementClient } from '@azure/arm-appservice';
import { DefaultAzureCredential } from '@azure/identity';

export interface BaseAppServiceInput {
  subscriptionId: string;
  resourceGroupName?: string;
  appName?: string;
}

export default abstract class BaseAzureAppServiceTool<T extends BaseAppServiceInput> extends MCPTool<T> {
  protected async getClient(subscriptionId: string): Promise<WebSiteManagementClient> {
    const credential = new DefaultAzureCredential();
    return new WebSiteManagementClient(credential, subscriptionId);
  }

  protected validateResourceGroup(resourceGroupName?: string): void {
    if (!resourceGroupName) {
      throw new Error('Resource Group name is required for this operation.');
    }
  }

  protected validateAppName(appName?: string): void {
    if (!appName) {
      throw new Error('App Service name is required for this operation.');
    }
  }
}
