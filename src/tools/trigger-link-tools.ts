import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class TriggerLinkTools {
  static readonly toolNames = [
    'search_trigger_links',
    'create_trigger_link',
    'update_trigger_link',
    'delete_trigger_link'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'search_trigger_links',
        description: 'Search and list all trigger links for a location. Trigger links fire workflow triggers when clicked — critical for lead gen tracking.',
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
        name: 'create_trigger_link',
        description: 'Create a new trigger link. When clicked, fires a workflow trigger for lead tracking.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name/label for the trigger link'
            },
            redirectTo: {
              type: 'string',
              description: 'URL to redirect to after trigger fires'
            },
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            }
          },
          required: ['name', 'redirectTo']
        }
      },
      {
        name: 'update_trigger_link',
        description: 'Update an existing trigger link name or redirect URL.',
        inputSchema: {
          type: 'object',
          properties: {
            linkId: {
              type: 'string',
              description: 'The trigger link ID to update'
            },
            name: {
              type: 'string',
              description: 'Updated name'
            },
            redirectTo: {
              type: 'string',
              description: 'Updated redirect URL'
            },
            locationId: {
              type: 'string',
              description: 'Location ID'
            }
          },
          required: ['linkId']
        }
      },
      {
        name: 'delete_trigger_link',
        description: 'Delete a trigger link by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            linkId: {
              type: 'string',
              description: 'The trigger link ID to delete'
            },
            locationId: {
              type: 'string',
              description: 'Location ID'
            }
          },
          required: ['linkId']
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'search_trigger_links': {
        const result = await this.ghlClient.searchTriggerLinks(locationId);
        return { success: true, data: result.data };
      }
      case 'create_trigger_link': {
        const result = await this.ghlClient.createTriggerLink(locationId, {
          name: params.name,
          redirectTo: params.redirectTo
        });
        return { success: true, data: result.data };
      }
      case 'update_trigger_link': {
        const { linkId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.updateTriggerLink(params.linkId, locationId, data);
        return { success: true, data: result.data };
      }
      case 'delete_trigger_link': {
        const result = await this.ghlClient.deleteTriggerLink(params.linkId, locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown trigger link tool: ${name}`);
    }
  }
}
