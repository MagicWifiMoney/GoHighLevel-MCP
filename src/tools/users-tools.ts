/**
 * GoHighLevel Users Tools
 * Implements user listing and retrieval for the MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class UsersTools {
  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'get_users',
        description: 'List all users for the current location/sub-account. Returns user IDs, names, emails, and roles.',
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
        name: 'get_user',
        description: 'Get detailed information about a specific user by ID',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'The user ID to retrieve'
            }
          },
          required: ['userId']
        }
      }
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_users':
        return this.getUsers(args);
      case 'get_user':
        return this.getUser(args);
      default:
        throw new Error(`Unknown users tool: ${name}`);
    }
  }

  private async getUsers(params: any): Promise<any> {
    try {
      const locationId = params.locationId || this.ghlClient.getConfig().locationId;
      const response = await this.ghlClient.getUsers(locationId);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to get users');
      }
      const users = response.data.users || response.data;
      return {
        success: true,
        users: Array.isArray(users) ? users : [],
        message: `Retrieved ${Array.isArray(users) ? users.length : 0} users`
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async getUser(params: any): Promise<any> {
    try {
      const response = await this.ghlClient.getUser(params.userId);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to get user');
      }
      return {
        success: true,
        user: response.data,
        message: 'User retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
