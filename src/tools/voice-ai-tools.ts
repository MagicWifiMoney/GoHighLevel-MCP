import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class VoiceAITools {
  static readonly toolNames = [
    'list_voice_ai_agents',
    'get_voice_ai_agent',
    'create_voice_ai_agent',
    'update_voice_ai_agent',
    'delete_voice_ai_agent',
    'list_voice_ai_actions',
    'create_voice_ai_action',
    'update_voice_ai_action',
    'delete_voice_ai_action',
    'get_voice_ai_call_logs'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_voice_ai_agents',
        description: 'List all Voice AI agents for a location. Voice AI agents handle inbound/outbound phone calls.',
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
        name: 'get_voice_ai_agent',
        description: 'Get details of a specific Voice AI agent by ID',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The Voice AI agent ID'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'create_voice_ai_agent',
        description: 'Create a new Voice AI agent for handling phone calls',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the voice agent'
            },
            phone: {
              type: 'string',
              description: 'Phone number to assign to the agent'
            },
            voiceId: {
              type: 'string',
              description: 'Voice ID for text-to-speech'
            },
            greeting: {
              type: 'string',
              description: 'Initial greeting when call connects'
            },
            goal: {
              type: 'string',
              description: 'Primary goal of the voice agent'
            },
            instructions: {
              type: 'string',
              description: 'Detailed instructions for the agent behavior'
            },
            knowledgeBaseIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Knowledge base IDs to attach'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['name']
        }
      },
      {
        name: 'update_voice_ai_agent',
        description: 'Update an existing Voice AI agent configuration',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The Voice AI agent ID to update'
            },
            name: { type: 'string', description: 'Updated name' },
            phone: { type: 'string', description: 'Updated phone number' },
            voiceId: { type: 'string', description: 'Updated voice ID' },
            greeting: { type: 'string', description: 'Updated greeting' },
            goal: { type: 'string', description: 'Updated goal' },
            instructions: { type: 'string', description: 'Updated instructions' },
            knowledgeBaseIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Updated knowledge base IDs'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'delete_voice_ai_agent',
        description: 'Delete a Voice AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The Voice AI agent ID to delete'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'list_voice_ai_actions',
        description: 'List all actions/goals configured for a Voice AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The Voice AI agent ID'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'create_voice_ai_action',
        description: 'Create a new action for a Voice AI agent (e.g. transfer call, book appointment)',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The Voice AI agent ID'
            },
            name: { type: 'string', description: 'Action name' },
            type: { type: 'string', description: 'Action type' },
            description: { type: 'string', description: 'What this action does' },
            config: {
              type: 'object',
              description: 'Action-specific configuration'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'update_voice_ai_action',
        description: 'Update an action on a Voice AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'The Voice AI agent ID' },
            actionId: { type: 'string', description: 'The action ID to update' },
            name: { type: 'string', description: 'Updated action name' },
            type: { type: 'string', description: 'Updated action type' },
            description: { type: 'string', description: 'Updated description' },
            config: { type: 'object', description: 'Updated configuration' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId', 'actionId']
        }
      },
      {
        name: 'delete_voice_ai_action',
        description: 'Delete an action from a Voice AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'The Voice AI agent ID' },
            actionId: { type: 'string', description: 'The action ID to delete' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId', 'actionId']
        }
      },
      {
        name: 'get_voice_ai_call_logs',
        description: 'Get call log data for Voice AI agents. Filter by agent, with pagination.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'Filter by specific agent ID'
            },
            limit: {
              type: 'number',
              description: 'Max results to return'
            },
            offset: {
              type: 'number',
              description: 'Pagination offset'
            },
            locationId: { type: 'string', description: 'Location ID' }
          }
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'list_voice_ai_agents': {
        const result = await this.ghlClient.listVoiceAIAgents(locationId);
        return { success: true, data: result.data };
      }
      case 'get_voice_ai_agent': {
        const result = await this.ghlClient.getVoiceAIAgent(params.agentId, locationId);
        return { success: true, data: result.data };
      }
      case 'create_voice_ai_agent': {
        const { agentId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.createVoiceAIAgent(data, locationId);
        return { success: true, data: result.data };
      }
      case 'update_voice_ai_agent': {
        const { agentId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.updateVoiceAIAgent(params.agentId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'delete_voice_ai_agent': {
        const result = await this.ghlClient.deleteVoiceAIAgent(params.agentId, locationId);
        return { success: true, data: result.data };
      }
      case 'list_voice_ai_actions': {
        const result = await this.ghlClient.listVoiceAIActions(params.agentId, locationId);
        return { success: true, data: result.data };
      }
      case 'create_voice_ai_action': {
        const { agentId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.createVoiceAIAction(params.agentId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'update_voice_ai_action': {
        const { agentId, actionId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.updateVoiceAIAction(params.agentId, params.actionId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'delete_voice_ai_action': {
        const result = await this.ghlClient.deleteVoiceAIAction(params.agentId, params.actionId, locationId);
        return { success: true, data: result.data };
      }
      case 'get_voice_ai_call_logs': {
        const queryParams: any = {};
        if (params.agentId) queryParams.agentId = params.agentId;
        if (params.limit) queryParams.limit = params.limit;
        if (params.offset) queryParams.offset = params.offset;
        const result = await this.ghlClient.getVoiceAICallLogs(locationId, queryParams);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown voice AI tool: ${name}`);
    }
  }
}
