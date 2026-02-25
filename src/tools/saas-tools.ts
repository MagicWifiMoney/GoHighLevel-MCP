import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class SaaSTools {
  static readonly toolNames = [
    'get_saas_locations',
    'enable_saas_location',
    'get_agency_plans',
    'get_saas_subscription',
    'bulk_enable_saas'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'get_saas_locations',
        description: 'List all SaaS-enabled locations for an agency. Shows which sub-accounts have rebilling/SaaS mode active. Requires agency token.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: {
              type: 'string',
              description: 'Company/Agency ID (required — uses GHL_COMPANY_ID env if not provided)'
            }
          },
          required: ['companyId']
        }
      },
      {
        name: 'enable_saas_location',
        description: 'Enable SaaS/rebilling mode on a sub-account. Requires agency token and Agency Pro plan.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID to enable SaaS on'
            },
            companyId: {
              type: 'string',
              description: 'Company/Agency ID'
            },
            planId: {
              type: 'string',
              description: 'SaaS plan ID to assign'
            }
          },
          required: ['locationId']
        }
      },
      {
        name: 'get_agency_plans',
        description: 'List all configured SaaS rebilling plans for an agency. Shows plan names, prices, and intervals. Requires agency token.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: {
              type: 'string',
              description: 'Company/Agency ID (required — uses GHL_COMPANY_ID env if not provided)'
            }
          },
          required: ['companyId']
        }
      },
      {
        name: 'get_saas_subscription',
        description: 'Get the SaaS subscription details for a specific location — plan, status, billing info.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID to get subscription for (uses default if not provided)'
            }
          }
        }
      },
      {
        name: 'bulk_enable_saas',
        description: 'Bulk enable SaaS mode for multiple locations at once. Requires agency token.',
        inputSchema: {
          type: 'object',
          properties: {
            locationIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of location IDs to enable SaaS on'
            },
            companyId: {
              type: 'string',
              description: 'Company/Agency ID'
            },
            planId: {
              type: 'string',
              description: 'SaaS plan ID to assign to all locations'
            }
          },
          required: ['locationIds']
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'get_saas_locations': {
        const result = await this.ghlClient.getSaaSLocations(params.companyId);
        return { success: true, data: result.data };
      }
      case 'enable_saas_location': {
        const result = await this.ghlClient.enableSaaSLocation(params.locationId, {
          companyId: params.companyId,
          planId: params.planId
        });
        return { success: true, data: result.data };
      }
      case 'get_agency_plans': {
        const result = await this.ghlClient.getAgencyPlans(params.companyId);
        return { success: true, data: result.data };
      }
      case 'get_saas_subscription': {
        const locationId = params.locationId || this.ghlClient.getConfig().locationId;
        const result = await this.ghlClient.getSaaSSubscription(locationId);
        return { success: true, data: result.data };
      }
      case 'bulk_enable_saas': {
        const result = await this.ghlClient.bulkEnableSaaS({
          locationIds: params.locationIds,
          companyId: params.companyId,
          planId: params.planId
        });
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown SaaS tool: ${name}`);
    }
  }
}
