import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class FunnelTools {
  static readonly toolNames = [
    'list_funnels',
    'list_funnel_pages',
    'count_funnel_pages',
    'create_funnel_redirect',
    'list_funnel_redirects',
    'update_funnel_redirect',
    'delete_funnel_redirect'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_funnels',
        description: 'List all funnels in a location. Funnels contain landing pages and multi-step flows.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            limit: {
              type: 'number',
              description: 'Number of results to return (default 10)'
            },
            offset: {
              type: 'number',
              description: 'Offset for pagination'
            }
          }
        }
      },
      {
        name: 'list_funnel_pages',
        description: 'List all pages across funnels, optionally filtered by funnel ID.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            funnelId: {
              type: 'string',
              description: 'Filter pages by specific funnel ID'
            },
            limit: {
              type: 'number',
              description: 'Number of results to return'
            },
            offset: {
              type: 'number',
              description: 'Offset for pagination'
            }
          }
        }
      },
      {
        name: 'count_funnel_pages',
        description: 'Get the total count of funnel pages in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            funnelId: {
              type: 'string',
              description: 'Filter count by specific funnel ID'
            }
          }
        }
      },
      {
        name: 'create_funnel_redirect',
        description: 'Create a URL redirect for funnels. Useful for short links and tracking.',
        inputSchema: {
          type: 'object',
          properties: {
            target: {
              type: 'string',
              description: 'Target URL to redirect to'
            },
            action: {
              type: 'string',
              description: 'Redirect action type (e.g., "funnel", "website", "url")'
            },
            domain: {
              type: 'string',
              description: 'Domain for the redirect'
            },
            path: {
              type: 'string',
              description: 'Path/slug for the redirect URL'
            },
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            }
          },
          required: ['target', 'action']
        }
      },
      {
        name: 'list_funnel_redirects',
        description: 'List all URL redirects configured for funnels in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            limit: {
              type: 'number',
              description: 'Number of results to return'
            },
            offset: {
              type: 'number',
              description: 'Offset for pagination'
            }
          }
        }
      },
      {
        name: 'update_funnel_redirect',
        description: 'Update an existing funnel redirect.',
        inputSchema: {
          type: 'object',
          properties: {
            redirectId: {
              type: 'string',
              description: 'The redirect ID to update'
            },
            target: {
              type: 'string',
              description: 'Updated target URL'
            },
            action: {
              type: 'string',
              description: 'Updated redirect action type'
            },
            domain: {
              type: 'string',
              description: 'Updated domain'
            },
            path: {
              type: 'string',
              description: 'Updated path/slug'
            },
            locationId: {
              type: 'string',
              description: 'Location ID'
            }
          },
          required: ['redirectId']
        }
      },
      {
        name: 'delete_funnel_redirect',
        description: 'Delete a funnel redirect by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            redirectId: {
              type: 'string',
              description: 'The redirect ID to delete'
            },
            locationId: {
              type: 'string',
              description: 'Location ID'
            }
          },
          required: ['redirectId']
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    const locationId = params.locationId || this.ghlClient.getConfig().locationId;

    switch (name) {
      case 'list_funnels': {
        const result = await this.ghlClient.listFunnels(locationId, {
          limit: params.limit,
          offset: params.offset
        });
        return { success: true, data: result.data };
      }
      case 'list_funnel_pages': {
        const result = await this.ghlClient.listFunnelPages(locationId, {
          funnelId: params.funnelId,
          limit: params.limit,
          offset: params.offset
        });
        return { success: true, data: result.data };
      }
      case 'count_funnel_pages': {
        const result = await this.ghlClient.countFunnelPages(locationId, params.funnelId);
        return { success: true, data: result.data };
      }
      case 'create_funnel_redirect': {
        const { locationId: _lid, ...data } = params;
        const result = await this.ghlClient.createFunnelRedirect(locationId, data);
        return { success: true, data: result.data };
      }
      case 'list_funnel_redirects': {
        const result = await this.ghlClient.listFunnelRedirects(locationId, {
          limit: params.limit,
          offset: params.offset
        });
        return { success: true, data: result.data };
      }
      case 'update_funnel_redirect': {
        const { redirectId, locationId: _lid, ...data } = params;
        const result = await this.ghlClient.updateFunnelRedirect(params.redirectId, locationId, data);
        return { success: true, data: result.data };
      }
      case 'delete_funnel_redirect': {
        const result = await this.ghlClient.deleteFunnelRedirect(params.redirectId, locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown funnel tool: ${name}`);
    }
  }
}
