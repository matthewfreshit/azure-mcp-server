import { z } from 'zod';
import BaseAzureAppServiceTool, { BaseAppServiceInput } from './BaseAzureAppServiceTool';

type GetAppConfigInput = Required<BaseAppServiceInput>;

class GetAppConfigTool extends BaseAzureAppServiceTool<GetAppConfigInput> {
  name = 'azure_apps_get_config';
  description = 'Get configuration of an Azure App Service';

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

  async execute(input: GetAppConfigInput) {
    this.validateResourceGroup(input.resourceGroupName);
    this.validateAppName(input.appName);

    const client = await this.getClient(input.subscriptionId);
    const config = await client.webApps.getConfiguration(input.resourceGroupName, input.appName);

    return {
      appName: input.appName,
      configuration: {
        alwaysOn: config.alwaysOn,
        appSettings: config.appSettings,
        autoHealEnabled: config.autoHealEnabled,
        connectionStrings: config.connectionStrings,
        defaultDocuments: config.defaultDocuments,
        detailedErrorLoggingEnabled: config.detailedErrorLoggingEnabled,
        documentRoot: config.documentRoot,
        ftpsState: config.ftpsState,
        handlerMappings: config.handlerMappings,
        http20Enabled: config.http20Enabled,
        httpLoggingEnabled: config.httpLoggingEnabled,
        ipSecurityRestrictions: config.ipSecurityRestrictions,
        javaVersion: config.javaVersion,
        linuxFxVersion: config.linuxFxVersion,
        loadBalancing: config.loadBalancing,
        localMySqlEnabled: config.localMySqlEnabled,
        logsDirectorySizeLimit: config.logsDirectorySizeLimit,
        managedPipelineMode: config.managedPipelineMode,
        minTlsVersion: config.minTlsVersion,
        netFrameworkVersion: config.netFrameworkVersion,
        nodeVersion: config.nodeVersion,
        numberOfWorkers: config.numberOfWorkers,
        phpVersion: config.phpVersion,
        pythonVersion: config.pythonVersion,
        remoteDebuggingEnabled: config.remoteDebuggingEnabled,
        requestTracingEnabled: config.requestTracingEnabled,
        scmType: config.scmType,
        use32BitWorkerProcess: config.use32BitWorkerProcess,
        webSocketsEnabled: config.webSocketsEnabled,
        windowsFxVersion: config.windowsFxVersion
      }
    };
  }
}

export default GetAppConfigTool;
