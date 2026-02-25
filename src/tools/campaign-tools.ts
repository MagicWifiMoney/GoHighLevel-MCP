import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class CampaignTools {
  static readonly toolNames = [
    'list_campaigns',
    'get_campaign'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_campaigns',
        description: 'List all campaigns for a location. Campaigns are automated drip sequences for contacts.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            status: {
              type: 'string',
              description: 'Filter by campaign status'
            }
          }
        }
      },
      {
        name: 'get_campaign',
        description: 'Get detailed information about a specific campaign by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: {
              type: 'string',
              description: 'The campaign ID to retrieve'
            },
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            }
          },
          required: ['campaignId']
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'list_campaigns': {
        const result = await this.ghlClient.listCampaigns(locationId, params.status);
        return { success: true, data: result.data };
      }
      case 'get_campaign': {
        const result = await this.ghlClient.getCampaign(params.campaignId, locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown campaign tool: ${name}`);
    }
  }
}
