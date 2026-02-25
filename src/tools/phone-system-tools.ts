import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class PhoneSystemTools {
  static readonly toolNames = [
    'list_phone_numbers'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_phone_numbers',
        description: 'List all active phone numbers for a location. Useful for validating phone system setup on new client accounts. Returns 404 if phone system not connected.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            }
          }
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'list_phone_numbers': {
        const result = await this.ghlClient.listPhoneNumbers(locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown phone system tool: ${name}`);
    }
  }
}
