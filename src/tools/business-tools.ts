/**
 * GoHighLevel Business Tools
 * Implements business/company CRUD operations for the MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class BusinessTools {
  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'get_businesses',
        description: 'List all businesses/companies for the current location',
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
        name: 'get_business',
        description: 'Get detailed information about a specific business by ID',
        inputSchema: {
          type: 'object',
          properties: {
            businessId: {
              type: 'string',
              description: 'The business ID to retrieve'
            }
          },
          required: ['businessId']
        }
      },
      {
        name: 'create_business',
        description: 'Create a new business/company in the location',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID (uses default if not provided)'
            },
            name: {
              type: 'string',
              description: 'Business name'
            },
            phone: {
              type: 'string',
              description: 'Business phone number'
            },
            email: {
              type: 'string',
              description: 'Business email address'
            },
            website: {
              type: 'string',
              description: 'Business website URL'
            },
            address: {
              type: 'string',
              description: 'Business street address'
            },
            city: {
              type: 'string',
              description: 'City'
            },
            state: {
              type: 'string',
              description: 'State/province'
            },
            country: {
              type: 'string',
              description: 'Country code'
            },
            postalCode: {
              type: 'string',
              description: 'Postal/ZIP code'
            },
            description: {
              type: 'string',
              description: 'Business description'
            }
          },
          required: ['name']
        }
      },
      {
        name: 'update_business',
        description: 'Update an existing business/company',
        inputSchema: {
          type: 'object',
          properties: {
            businessId: {
              type: 'string',
              description: 'The business ID to update'
            },
            name: {
              type: 'string',
              description: 'Updated business name'
            },
            phone: {
              type: 'string',
              description: 'Updated phone number'
            },
            email: {
              type: 'string',
              description: 'Updated email address'
            },
            website: {
              type: 'string',
              description: 'Updated website URL'
            },
            address: {
              type: 'string',
              description: 'Updated street address'
            },
            city: {
              type: 'string',
              description: 'Updated city'
            },
            state: {
              type: 'string',
              description: 'Updated state/province'
            },
            country: {
              type: 'string',
              description: 'Updated country code'
            },
            postalCode: {
              type: 'string',
              description: 'Updated postal/ZIP code'
            },
            description: {
              type: 'string',
              description: 'Updated description'
            }
          },
          required: ['businessId']
        }
      },
      {
        name: 'delete_business',
        description: 'Delete a business/company from the location',
        inputSchema: {
          type: 'object',
          properties: {
            businessId: {
              type: 'string',
              description: 'The business ID to delete'
            }
          },
          required: ['businessId']
        }
      }
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_businesses':
        return this.getBusinesses(args);
      case 'get_business':
        return this.getBusiness(args);
      case 'create_business':
        return this.createBusiness(args);
      case 'update_business':
        return this.updateBusiness(args);
      case 'delete_business':
        return this.deleteBusiness(args);
      default:
        throw new Error(`Unknown business tool: ${name}`);
    }
  }

  private async getBusinesses(params: any): Promise<any> {
    try {
      const locationId = params.locationId || this.ghlClient.getConfig().locationId;
      const response = await this.ghlClient.getBusinesses(locationId);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to get businesses');
      }
      const businesses = response.data.businesses || response.data;
      return {
        success: true,
        businesses: Array.isArray(businesses) ? businesses : [],
        message: `Retrieved ${Array.isArray(businesses) ? businesses.length : 0} businesses`
      };
    } catch (error) {
      throw new Error(`Failed to get businesses: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async getBusiness(params: any): Promise<any> {
    try {
      const response = await this.ghlClient.getBusiness(params.businessId);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to get business');
      }
      return {
        success: true,
        business: response.data,
        message: 'Business retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get business: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async createBusiness(params: any): Promise<any> {
    try {
      const locationId = params.locationId || this.ghlClient.getConfig().locationId;
      const { locationId: _, ...businessData } = params;
      const response = await this.ghlClient.createBusiness(locationId, businessData);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create business');
      }
      return {
        success: true,
        business: response.data,
        message: `Business "${params.name}" created successfully`
      };
    } catch (error) {
      throw new Error(`Failed to create business: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async updateBusiness(params: any): Promise<any> {
    try {
      const { businessId, ...updateData } = params;
      const response = await this.ghlClient.updateBusiness(businessId, updateData);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update business');
      }
      return {
        success: true,
        business: response.data,
        message: 'Business updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update business: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async deleteBusiness(params: any): Promise<any> {
    try {
      const response = await this.ghlClient.deleteBusiness(params.businessId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete business');
      }
      return {
        success: true,
        message: 'Business deleted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to delete business: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
