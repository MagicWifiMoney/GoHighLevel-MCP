import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class SnapshotTools {
  static readonly toolNames = [
    'list_snapshots',
    'create_snapshot_share_link',
    'get_snapshot_push_status',
    'get_latest_snapshot_push'
  ];

  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_snapshots',
        description: 'List all own and imported snapshots. Snapshots are sub-account templates. Requires agency token.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: {
              type: 'string',
              description: 'Company/Agency ID (uses GHL_COMPANY_ID env if not provided)'
            }
          }
        }
      },
      {
        name: 'create_snapshot_share_link',
        description: 'Generate a share link for a snapshot so it can be imported into other sub-accounts. Requires agency token.',
        inputSchema: {
          type: 'object',
          properties: {
            snapshot_id: {
              type: 'string',
              description: 'The snapshot ID to share'
            },
            share_type: {
              type: 'string',
              enum: ['link', 'permanent', 'one_time'],
              description: 'Type of share link to generate'
            },
            companyId: {
              type: 'string',
              description: 'Company/Agency ID'
            },
            relationship_number: {
              type: 'string',
              description: 'Optional relationship number for the share'
            }
          },
          required: ['snapshot_id', 'share_type']
        }
      },
      {
        name: 'get_snapshot_push_status',
        description: 'Get snapshot push statuses between date range. Shows history of snapshot deployments. Requires agency token.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: {
              type: 'string',
              description: 'Company/Agency ID'
            },
            snapshotId: {
              type: 'string',
              description: 'Filter by specific snapshot ID'
            },
            startDate: {
              type: 'string',
              description: 'Start date (ISO string or YYYY-MM-DD)'
            },
            endDate: {
              type: 'string',
              description: 'End date (ISO string or YYYY-MM-DD)'
            },
            locationId: {
              type: 'string',
              description: 'Filter by target location ID'
            },
            status: {
              type: 'string',
              description: 'Filter by push status'
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
        name: 'get_latest_snapshot_push',
        description: 'Get the latest snapshot push status for a specific location. Requires agency token.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: {
              type: 'string',
              description: 'Company/Agency ID'
            },
            locationId: {
              type: 'string',
              description: 'Location ID to check push status for (uses default if not provided)'
            }
          }
        }
      }
    ];
  }

  async executeTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'list_snapshots': {
        const result = await this.ghlClient.listSnapshots(params.companyId);
        return { success: true, data: result.data };
      }
      case 'create_snapshot_share_link': {
        const result = await this.ghlClient.createSnapshotShareLink({
          snapshot_id: params.snapshot_id,
          share_type: params.share_type,
          companyId: params.companyId,
          relationship_number: params.relationship_number
        });
        return { success: true, data: result.data };
      }
      case 'get_snapshot_push_status': {
        const { companyId, ...queryParams } = params;
        const result = await this.ghlClient.getSnapshotPushStatus(companyId, queryParams);
        return { success: true, data: result.data };
      }
      case 'get_latest_snapshot_push': {
        const locationId = params.locationId || this.ghlClient.getConfig().locationId;
        const result = await this.ghlClient.getLatestSnapshotPush(params.companyId, locationId);
        return { success: true, data: result.data };
      }
      default:
        throw new Error(`Unknown snapshot tool: ${name}`);
    }
  }
}
