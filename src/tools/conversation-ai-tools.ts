import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class ConversationAITools {
  static readonly toolNames = [
    'list_conversation_ai_agents',
    'get_conversation_ai_agent',
    'create_conversation_ai_agent',
    'update_conversation_ai_agent',
    'delete_conversation_ai_agent',
    'list_conversation_ai_actions',
    'attach_conversation_ai_action',
    'get_conversation_ai_action',
    'update_conversation_ai_action',
    'delete_conversation_ai_action',
    'get_conversation_ai_generation'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_conversation_ai_agents',
        description: 'List all Conversation AI agents for a location. Returns all configured AI chatbot agents.',
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
        name: 'get_conversation_ai_agent',
        description: 'Get details of a specific Conversation AI agent by ID',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The AI agent ID'
            },
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            }
          },
          required: ['agentId']
        }
      },
      {
        name: 'create_conversation_ai_agent',
        description: 'Create a new Conversation AI agent. Supports autopilot and suggestive modes across webchat, SMS, email channels.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the AI agent'
            },
            businessName: {
              type: 'string',
              description: 'Business name the agent represents'
            },
            mode: {
              type: 'string',
              enum: ['autopilot', 'suggestive'],
              description: 'Agent mode: autopilot (fully autonomous) or suggestive (suggests responses)'
            },
            channels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Channels to enable: webchat, sms, email, etc.'
            },
            isPrimary: {
              type: 'boolean',
              description: 'Whether this is the primary agent for the location'
            },
            personality: {
              type: 'object',
              properties: {
                tone: { type: 'string', description: 'Communication tone (e.g. professional, friendly)' },
                greeting: { type: 'string', description: 'Initial greeting message' }
              },
              description: 'Agent personality configuration'
            },
            goal: {
              type: 'string',
              description: 'Primary goal of the agent (e.g. book appointments, answer questions)'
            },
            knowledgeBaseIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Knowledge base IDs to attach to this agent'
            },
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            }
          },
          required: ['name']
        }
      },
      {
        name: 'update_conversation_ai_agent',
        description: 'Update an existing Conversation AI agent configuration',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The AI agent ID to update'
            },
            name: { type: 'string', description: 'Updated name' },
            businessName: { type: 'string', description: 'Updated business name' },
            mode: {
              type: 'string',
              enum: ['autopilot', 'suggestive'],
              description: 'Updated mode'
            },
            channels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Updated channels list'
            },
            isPrimary: { type: 'boolean', description: 'Updated primary status' },
            personality: {
              type: 'object',
              properties: {
                tone: { type: 'string' },
                greeting: { type: 'string' }
              }
            },
            goal: { type: 'string', description: 'Updated goal' },
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
        name: 'delete_conversation_ai_agent',
        description: 'Delete a Conversation AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The AI agent ID to delete'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'list_conversation_ai_actions',
        description: 'List all actions attached to a Conversation AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The AI agent ID'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'attach_conversation_ai_action',
        description: 'Attach an action to a Conversation AI agent (e.g. book appointment, transfer to human)',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: {
              type: 'string',
              description: 'The AI agent ID'
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
        name: 'get_conversation_ai_action',
        description: 'Get details of a specific action on a Conversation AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'The AI agent ID' },
            actionId: { type: 'string', description: 'The action ID' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId', 'actionId']
        }
      },
      {
        name: 'update_conversation_ai_action',
        description: 'Update an action on a Conversation AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'The AI agent ID' },
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
        name: 'delete_conversation_ai_action',
        description: 'Delete an action from a Conversation AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'The AI agent ID' },
            actionId: { type: 'string', description: 'The action ID to delete' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId', 'actionId']
        }
      },
      {
        name: 'get_conversation_ai_generation',
        description: 'Get details of a specific AI generation/response by ID',
        inputSchema: {
          type: 'object',
          properties: {
            generationId: { type: 'string', description: 'The generation ID' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['generationId']
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'list_conversation_ai_agents': {
        const result = await this.ghlClient.listConversationAIAgents(locationId);
        return { success: true, data: result.data };
      }
      case 'get_conversation_ai_agent': {
        const result = await this.ghlClient.getConversationAIAgent(params.agentId, locationId);
        return { success: true, data: result.data };
      }
      case 'create_conversation_ai_agent': {
        const { agentId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.createConversationAIAgent(data, locationId);
        return { success: true, data: result.data };
      }
      case 'update_conversation_ai_agent': {
        const { agentId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.updateConversationAIAgent(params.agentId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'delete_conversation_ai_agent': {
        const result = await this.ghlClient.deleteConversationAIAgent(params.agentId, locationId);
        return { success: true, data: result.data };
      }
      case 'list_conversation_ai_actions': {
        const result = await this.ghlClient.listConversationAIActions(params.agentId, locationId);
        return { success: true, data: result.data };
      }
      case 'attach_conversation_ai_action': {
        const { agentId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.attachConversationAIAction(params.agentId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'get_conversation_ai_action': {
        const result = await this.ghlClient.getConversationAIAction(params.agentId, params.actionId, locationId);
        return { success: true, data: result.data };
      }
      case 'update_conversation_ai_action': {
        const { agentId, actionId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.updateConversationAIAction(params.agentId, params.actionId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'delete_conversation_ai_action': {
        const result = await this.ghlClient.deleteConversationAIAction(params.agentId, params.actionId, locationId);
        return { success: true, data: result.data };
      }
      case 'get_conversation_ai_generation': {
        const result = await this.ghlClient.getConversationAIGeneration(params.generationId, locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown conversation AI tool: ${name}`);
    }
  }
}
