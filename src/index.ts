import { MCPServer } from 'mcp-framework';

const server = new MCPServer({
  name: 'azure-mcp-server',
  version: '1.0.1'
});

server.start();
