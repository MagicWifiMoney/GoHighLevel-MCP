/**
 * GoHighLevel Forms Tools
 * Implements form listing and submission retrieval for the MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class FormsTools {
  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'get_forms',
        description: 'List all forms for the current location',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            skip: {
              type: 'number',
              description: 'Number of results to skip for pagination (default: 0)'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 20)'
            },
            type: {
              type: 'string',
              description: 'Filter by form type',
              enum: ['folder', 'form']
            }
          }
        }
      },
      {
        name: 'get_form_submissions',
        description: 'Get form submissions with optional filtering by form ID, date range, and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            formId: {
              type: 'string',
              description: 'Filter submissions by specific form ID'
            },
            startAt: {
              type: 'string',
              description: 'Start date filter (ISO format, e.g. 2024-01-01)'
            },
            endAt: {
              type: 'string',
              description: 'End date filter (ISO format, e.g. 2024-12-31)'
            },
            page: {
              type: 'number',
              description: 'Page number for pagination (default: 1)'
            },
            limit: {
              type: 'number',
              description: 'Number of submissions per page (default: 20)'
            },
            q: {
              type: 'string',
              description: 'Search query string'
            }
          }
        }
      }
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_forms':
        return this.getForms(args);
      case 'get_form_submissions':
        return this.getFormSubmissions(args);
      default:
        throw new Error(`Unknown forms tool: ${name}`);
    }
  }

  private async getForms(params: any): Promise<any> {
    try {
      const locationId = params.locationId || this.ghlClient.getConfig().locationId;
      const queryParams: any = { locationId };
      if (params.skip !== undefined) queryParams.skip = params.skip;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.type) queryParams.type = params.type;

      const response = await this.ghlClient.getForms(queryParams);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to get forms');
      }
      const forms = response.data.forms || response.data;
      return {
        success: true,
        forms: Array.isArray(forms) ? forms : [],
        message: `Retrieved ${Array.isArray(forms) ? forms.length : 0} forms`
      };
    } catch (error) {
      throw new Error(`Failed to get forms: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async getFormSubmissions(params: any): Promise<any> {
    try {
      const locationId = params.locationId || this.ghlClient.getConfig().locationId;
      const queryParams: any = { locationId };
      if (params.formId) queryParams.formId = params.formId;
      if (params.startAt) queryParams.startAt = params.startAt;
      if (params.endAt) queryParams.endAt = params.endAt;
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.q) queryParams.q = params.q;

      const response = await this.ghlClient.getFormSubmissions(queryParams);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to get form submissions');
      }
      const submissions = response.data.submissions || response.data;
      return {
        success: true,
        submissions: Array.isArray(submissions) ? submissions : [],
        meta: response.data.meta,
        message: `Retrieved ${Array.isArray(submissions) ? submissions.length : 0} submissions`
      };
    } catch (error) {
      throw new Error(`Failed to get form submissions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
