import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class AgentStudioTools {
  static readonly toolNames = [
    'list_agent_studio_agents',
    'get_agent_studio_agent',
    'create_agent_studio_action'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_agent_studio_agents',
        description: 'List all Agent Studio agents for a location. Agent Studio is the newer agent management interface in GHL.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            }
          }
        }
      },
      {
        name: 'get_agent_studio_agent',
        description: 'Get details of a specific Agent Studio agent by ID',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The agent ID'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'create_agent_studio_action',
        description: 'Create a new action for an Agent Studio agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The agent ID to add action to'
            },
            name: { type: 'string', description: 'Action name' },
            type: { type: 'string', description: 'Action type' },
            config: {
              type: 'object',
              description: 'Action configuration'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'list_agent_studio_agents': {
        const result = await this.ghlClient.listAgentStudioAgents(locationId);
        return { success: true, data: result.data };
      }
      case 'get_agent_studio_agent': {
        const result = await this.ghlClient.getAgentStudioAgent(params.agentId, locationId);
        return { success: true, data: result.data };
      }
      case 'create_agent_studio_action': {
        const { agentId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.createAgentStudioAction(params.agentId, data, locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown agent studio tool: ${name}`);
    }
  }
}
