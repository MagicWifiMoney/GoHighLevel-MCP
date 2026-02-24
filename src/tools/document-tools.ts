import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class DocumentTools {
  static readonly toolNames = [
    'list_documents',
    'get_document',
    'send_document',
    'list_document_templates',
    'get_document_template',
    'send_document_template'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_documents',
        description: 'List all documents and contracts for a location',
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
        name: 'get_document',
        description: 'Get details of a specific document or contract by ID',
        inputSchema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'The document ID'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['documentId']
        }
      },
      {
        name: 'send_document',
        description: 'Send a document or contract to a contact for signing/viewing',
        inputSchema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'The document ID to send'
            },
            contactId: {
              type: 'string',
              description: 'Contact ID to send the document to'
            },
            email: {
              type: 'string',
              description: 'Email address to send to (if not using contactId)'
            },
            subject: {
              type: 'string',
              description: 'Email subject line'
            },
            message: {
              type: 'string',
              description: 'Custom message to include'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['documentId']
        }
      },
      {
        name: 'list_document_templates',
        description: 'List all document/contract templates for a location',
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
        name: 'get_document_template',
        description: 'Get details of a specific document template by ID',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: {
              type: 'string',
              description: 'The template ID'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['templateId']
        }
      },
      {
        name: 'send_document_template',
        description: 'Send a document template to a contact, creating a new document instance from the template',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: {
              type: 'string',
              description: 'The template ID to send'
            },
            contactId: {
              type: 'string',
              description: 'Contact ID to send to'
            },
            email: {
              type: 'string',
              description: 'Email address to send to'
            },
            subject: {
              type: 'string',
              description: 'Email subject line'
            },
            message: {
              type: 'string',
              description: 'Custom message to include'
            },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['templateId']
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'list_documents': {
        const result = await this.ghlClient.listDocuments(locationId);
        return { success: true, data: result.data };
      }
      case 'get_document': {
        const result = await this.ghlClient.getDocument(params.documentId, locationId);
        return { success: true, data: result.data };
      }
      case 'send_document': {
        const { documentId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.sendDocument(params.documentId, data, locationId);
        return { success: true, data: result.data };
      }
      case 'list_document_templates': {
        const result = await this.ghlClient.listDocumentTemplates(locationId);
        return { success: true, data: result.data };
      }
      case 'get_document_template': {
        const result = await this.ghlClient.getDocumentTemplate(params.templateId, locationId);
        return { success: true, data: result.data };
      }
      case 'send_document_template': {
        const { templateId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.sendDocumentTemplate(params.templateId, data, locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown document tool: ${name}`);
    }
  }
}
