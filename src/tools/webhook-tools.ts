/**
 * GoHighLevel Webhook Tools
 * Implements webhook subscription management for the MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class WebhookTools {
  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'list_webhooks',
        description: 'List all webhook subscriptions for the current location',
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
        name: 'create_webhook',
        description: 'Create a new webhook subscription to receive event notifications',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            url: {
              type: 'string',
              description: 'The URL to send webhook events to (must be HTTPS)'
            },
            events: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of event types to subscribe to (e.g. ContactCreate, ContactUpdate, OpportunityCreate, AppointmentCreate, etc.)'
            }
          },
          required: ['url', 'events']
        }
      },
      {
        name: 'update_webhook',
        description: 'Update an existing webhook subscription',
        inputSchema: {
          type: 'object',
          properties: {
            webhookId: {
              type: 'string',
              description: 'The webhook subscription ID to update'
            },
            url: {
              type: 'string',
              description: 'Updated webhook URL'
            },
            events: {
              type: 'array',
              items: { type: 'string' },
              description: 'Updated list of event types'
            }
          },
          required: ['webhookId']
        }
      },
      {
        name: 'delete_webhook',
        description: 'Delete a webhook subscription',
        inputSchema: {
          type: 'object',
          properties: {
            webhookId: {
              type: 'string',
              description: 'The webhook subscription ID to delete'
            }
          },
          required: ['webhookId']
        }
      }
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'list_webhooks':
        return this.listWebhooks(args);
      case 'create_webhook':
        return this.createWebhook(args);
      case 'update_webhook':
        return this.updateWebhook(args);
      case 'delete_webhook':
        return this.deleteWebhook(args);
      default:
        throw new Error(`Unknown webhook tool: ${name}`);
    }
  }

  private async listWebhooks(params: any): Promise<any> {
    try {
      const locationId = params.locationId || this.ghlClient.getConfig().locationId;
      const response = await this.ghlClient.listWebhooks(locationId);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to list webhooks');
      }
      const webhooks = response.data.webhooks || response.data;
      return {
        success: true,
        webhooks: Array.isArray(webhooks) ? webhooks : [],
        message: `Retrieved ${Array.isArray(webhooks) ? webhooks.length : 0} webhook subscriptions`
      };
    } catch (error) {
      throw new Error(`Failed to list webhooks: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async createWebhook(params: any): Promise<any> {
    try {
      const locationId = params.locationId || this.ghlClient.getConfig().locationId;
      const response = await this.ghlClient.createWebhook(locationId, {
        url: params.url,
        events: params.events
      });
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create webhook');
      }
      return {
        success: true,
        webhook: response.data,
        message: `Webhook created for ${params.events.length} event(s)`
      };
    } catch (error) {
      throw new Error(`Failed to create webhook: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async updateWebhook(params: any): Promise<any> {
    try {
      const { webhookId, ...updateData } = params;
      const response = await this.ghlClient.updateWebhook(webhookId, updateData);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update webhook');
      }
      return {
        success: true,
        webhook: response.data,
        message: 'Webhook updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update webhook: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async deleteWebhook(params: any): Promise<any> {
    try {
      const response = await this.ghlClient.deleteWebhook(params.webhookId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete webhook');
      }
      return {
        success: true,
        message: 'Webhook deleted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to delete webhook: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
