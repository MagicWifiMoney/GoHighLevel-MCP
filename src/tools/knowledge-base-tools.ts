import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class KnowledgeBaseTools {
  static readonly toolNames = [
    'list_knowledge_bases',
    'get_knowledge_base',
    'create_knowledge_base',
    'update_knowledge_base',
    'delete_knowledge_base',
    'list_knowledge_base_faqs',
    'create_knowledge_base_faq',
    'update_knowledge_base_faq',
    'delete_knowledge_base_faq'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_knowledge_bases',
        description: 'List all knowledge bases for a location. Max 15 per location. Knowledge bases provide context to AI agents.',
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
        name: 'get_knowledge_base',
        description: 'Get details of a specific knowledge base by ID',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The knowledge base ID'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'create_knowledge_base',
        description: 'Create a new knowledge base. Use to store FAQ content, business info, and training data for AI agents.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the knowledge base'
            },
            description: {
              type: 'string',
              description: 'Description of the knowledge base content and purpose'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['name']
        }
      },
      {
        name: 'update_knowledge_base',
        description: 'Update a knowledge base name or description',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The knowledge base ID to update'
            },
            name: { type: 'string', description: 'Updated name' },
            description: { type: 'string', description: 'Updated description' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'delete_knowledge_base',
        description: 'Delete a knowledge base and all its FAQ entries',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The knowledge base ID to delete'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'list_knowledge_base_faqs',
        description: 'List all FAQ entries in a knowledge base',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The knowledge base ID'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'create_knowledge_base_faq',
        description: 'Add a new FAQ entry (question + answer pair) to a knowledge base',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The knowledge base ID to add FAQ to'
            },
            question: {
              type: 'string',
              description: 'The question text'
            },
            answer: {
              type: 'string',
              description: 'The answer text'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['knowledgeBaseId', 'question', 'answer']
        }
      },
      {
        name: 'update_knowledge_base_faq',
        description: 'Update an existing FAQ entry in a knowledge base',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The knowledge base ID'
            },
            faqId: {
              type: 'string',
              description: 'The FAQ entry ID to update'
            },
            question: { type: 'string', description: 'Updated question' },
            answer: { type: 'string', description: 'Updated answer' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['knowledgeBaseId', 'faqId']
        }
      },
      {
        name: 'delete_knowledge_base_faq',
        description: 'Delete an FAQ entry from a knowledge base',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The knowledge base ID'
            },
            faqId: {
              type: 'string',
              description: 'The FAQ entry ID to delete'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['knowledgeBaseId', 'faqId']
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'list_knowledge_bases': {
        const result = await this.ghlClient.listKnowledgeBases(locationId);
        return { success: true, data: result.data };
      }
      case 'get_knowledge_base': {
        const result = await this.ghlClient.getKnowledgeBase(params.knowledgeBaseId, locationId);
        return { success: true, data: result.data };
      }
      case 'create_knowledge_base': {
        const { knowledgeBaseId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.createKnowledgeBase(data, locationId);
        return { success: true, data: result.data };
      }
      case 'update_knowledge_base': {
        const { knowledgeBaseId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.updateKnowledgeBase(params.knowledgeBaseId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'delete_knowledge_base': {
        const result = await this.ghlClient.deleteKnowledgeBase(params.knowledgeBaseId, locationId);
        return { success: true, data: result.data };
      }
      case 'list_knowledge_base_faqs': {
        const result = await this.ghlClient.listKnowledgeBaseFAQs(params.knowledgeBaseId, locationId);
        return { success: true, data: result.data };
      }
      case 'create_knowledge_base_faq': {
        const { knowledgeBaseId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.createKnowledgeBaseFAQ(params.knowledgeBaseId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'update_knowledge_base_faq': {
        const { knowledgeBaseId, faqId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.updateKnowledgeBaseFAQ(params.knowledgeBaseId, params.faqId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'delete_knowledge_base_faq': {
        const result = await this.ghlClient.deleteKnowledgeBaseFAQ(params.knowledgeBaseId, params.faqId, locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown knowledge base tool: ${name}`);
    }
  }
}
