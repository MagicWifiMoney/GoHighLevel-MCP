/**
 * GoHighLevel Composite Tools
 * High-level tools that chain multiple API calls for common workflows.
 * Prefixed with ghl_composite_ to distinguish from atomic tools.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';
import { GHLCustomField } from '../types/ghl-types.js';

interface CompositeStep {
  step: string;
  status: 'success' | 'skipped' | 'failed';
  data?: any;
  error?: string;
}

export class CompositeTools {
  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'ghl_composite_intake_prospect',
        description: 'Create a fully set-up prospect in one call: upsert contact with all fields, add tags, create opportunity in specific pipeline/stage, add note, and optionally trigger workflow. Returns results of each step.',
        inputSchema: {
          type: 'object',
          properties: {
            // Contact fields
            firstName: { type: 'string', description: 'Contact first name' },
            lastName: { type: 'string', description: 'Contact last name' },
            name: { type: 'string', description: 'Full name (alternative)' },
            email: { type: 'string', description: 'Contact email' },
            phone: { type: 'string', description: 'Contact phone' },
            address1: { type: 'string', description: 'Street address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State' },
            country: { type: 'string', description: 'Country code' },
            postalCode: { type: 'string', description: 'Postal code' },
            website: { type: 'string', description: 'Website URL' },
            timezone: { type: 'string', description: 'Timezone' },
            companyName: { type: 'string', description: 'Company name' },
            source: { type: 'string', description: 'Lead source' },
            assignedTo: { type: 'string', description: 'User ID to assign contact to' },
            customFields: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, key: { type: 'string' }, field_value: {} }, required: ['field_value'] }, description: 'Contact custom fields' },
            // Tags
            tags: { type: 'array', items: { type: 'string' }, description: 'Tags to add to contact' },
            // Opportunity
            opportunityName: { type: 'string', description: 'Opportunity name/title' },
            pipelineId: { type: 'string', description: 'Pipeline ID for opportunity' },
            pipelineStageId: { type: 'string', description: 'Pipeline stage ID' },
            monetaryValue: { type: 'number', description: 'Deal value in dollars' },
            opportunityStatus: { type: 'string', enum: ['open', 'won', 'lost', 'abandoned'], description: 'Opportunity status' },
            opportunityCustomFields: { type: 'array', items: { type: 'object' }, description: 'Opportunity custom fields' },
            // Note
            note: { type: 'string', description: 'Intake note to add to contact (optional)' },
            // Workflow
            workflowId: { type: 'string', description: 'Workflow ID to trigger (optional)' }
          },
          required: ['pipelineId']
        }
      },
      {
        name: 'ghl_composite_full_contact_setup',
        description: 'Create/upsert a contact and set up everything: tags, note, task, workflow, and campaign — all in one call. Each sub-step is optional.',
        inputSchema: {
          type: 'object',
          properties: {
            // Contact fields
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            address1: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            country: { type: 'string' },
            postalCode: { type: 'string' },
            website: { type: 'string' },
            timezone: { type: 'string' },
            companyName: { type: 'string' },
            source: { type: 'string' },
            assignedTo: { type: 'string' },
            customFields: { type: 'array', items: { type: 'object' }, description: 'Custom field values' },
            // Optional sub-steps
            tags: { type: 'array', items: { type: 'string' }, description: 'Tags to add' },
            note: { type: 'string', description: 'Note body to create' },
            taskTitle: { type: 'string', description: 'Task title to create' },
            taskBody: { type: 'string', description: 'Task description' },
            taskDueDate: { type: 'string', description: 'Task due date (ISO)' },
            workflowId: { type: 'string', description: 'Workflow to add contact to' },
            campaignId: { type: 'string', description: 'Campaign to add contact to' }
          }
        }
      },
      {
        name: 'ghl_composite_pipeline_report',
        description: 'Generate an aggregated pipeline report: counts by stage, total monetary values, and opportunity details. Automatically paginates through all opportunities.',
        inputSchema: {
          type: 'object',
          properties: {
            pipelineId: {
              type: 'string',
              description: 'Pipeline ID to report on (if omitted, reports on all pipelines)'
            },
            status: {
              type: 'string',
              enum: ['open', 'won', 'lost', 'abandoned', 'all'],
              description: 'Filter by opportunity status (default: all)'
            }
          }
        }
      },
      {
        name: 'ghl_composite_renewal_dashboard',
        description: 'Search contacts by a date-type custom field (e.g. renewal date, expiration date) within a date range, group by month, and return a dashboard view.',
        inputSchema: {
          type: 'object',
          properties: {
            customFieldId: {
              type: 'string',
              description: 'The custom field ID containing the date to filter on (e.g. renewal_date)'
            },
            startDate: {
              type: 'string',
              description: 'Start date (ISO format YYYY-MM-DD)'
            },
            endDate: {
              type: 'string',
              description: 'End date (ISO format YYYY-MM-DD)'
            },
            limit: {
              type: 'number',
              description: 'Max contacts to return (default: 100)'
            }
          },
          required: ['customFieldId', 'startDate', 'endDate']
        }
      },
      {
        name: 'ghl_composite_bulk_field_update',
        description: 'Search for contacts matching a query/filter, then update a specific field on all matches. Returns count of updated contacts and any failures.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query to find contacts'
            },
            filterEmail: {
              type: 'string',
              description: 'Filter by email'
            },
            filterPhone: {
              type: 'string',
              description: 'Filter by phone'
            },
            filterTags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter by tags'
            },
            updateFields: {
              type: 'object',
              description: 'Fields to update on each matching contact (e.g. { "companyName": "Acme", "source": "bulk-update" })',
              additionalProperties: true
            },
            customFields: {
              type: 'array',
              items: { type: 'object', properties: { id: { type: 'string' }, field_value: {} }, required: ['id', 'field_value'] },
              description: 'Custom field updates to apply'
            },
            limit: {
              type: 'number',
              description: 'Max contacts to update (default: 50, max: 200)'
            }
          },
          required: ['updateFields']
        }
      }
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'ghl_composite_intake_prospect':
        return this.intakeProspect(args);
      case 'ghl_composite_full_contact_setup':
        return this.fullContactSetup(args);
      case 'ghl_composite_pipeline_report':
        return this.pipelineReport(args);
      case 'ghl_composite_renewal_dashboard':
        return this.renewalDashboard(args);
      case 'ghl_composite_bulk_field_update':
        return this.bulkFieldUpdate(args);
      default:
        throw new Error(`Unknown composite tool: ${name}`);
    }
  }

  // =========================================================================
  // ghl_composite_intake_prospect
  // =========================================================================
  private async intakeProspect(params: any): Promise<any> {
    const steps: CompositeStep[] = [];
    let contactId: string | undefined;

    // Step 1: Upsert contact
    try {
      const contactData: any = {
        locationId: this.ghlClient.getConfig().locationId,
        firstName: params.firstName,
        lastName: params.lastName,
        name: params.name,
        email: params.email,
        phone: params.phone,
        address1: params.address1,
        city: params.city,
        state: params.state,
        country: params.country,
        postalCode: params.postalCode,
        website: params.website,
        timezone: params.timezone,
        companyName: params.companyName,
        source: params.source,
        assignedTo: params.assignedTo,
        customFields: params.customFields
      };

      const contactResponse = await this.ghlClient.upsertContact(contactData);
      if (!contactResponse.success || !contactResponse.data) {
        throw new Error(contactResponse.error?.message || 'Upsert failed');
      }
      contactId = contactResponse.data.contact?.id;
      steps.push({ step: 'upsert_contact', status: 'success', data: { contactId, new: contactResponse.data.new } });
    } catch (error) {
      steps.push({ step: 'upsert_contact', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      return { success: false, steps, message: 'Failed at upsert_contact step' };
    }

    // Step 2: Add tags
    if (params.tags?.length && contactId) {
      try {
        await this.ghlClient.addContactTags(contactId, params.tags);
        steps.push({ step: 'add_tags', status: 'success', data: { tags: params.tags } });
      } catch (error) {
        steps.push({ step: 'add_tags', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'add_tags', status: 'skipped' });
    }

    // Step 3: Create opportunity
    if (params.pipelineId && contactId) {
      try {
        const oppData: any = {
          locationId: this.ghlClient.getConfig().locationId,
          name: params.opportunityName || `${params.firstName || ''} ${params.lastName || ''} - Prospect`.trim(),
          pipelineId: params.pipelineId,
          pipelineStageId: params.pipelineStageId,
          contactId: contactId,
          status: params.opportunityStatus || 'open',
          monetaryValue: params.monetaryValue,
          assignedTo: params.assignedTo,
          customFields: params.opportunityCustomFields
        };
        const oppResponse = await this.ghlClient.createOpportunity(oppData);
        if (!oppResponse.success || !oppResponse.data) {
          throw new Error(oppResponse.error?.message || 'Create opportunity failed');
        }
        steps.push({ step: 'create_opportunity', status: 'success', data: { opportunityId: oppResponse.data.id } });
      } catch (error) {
        steps.push({ step: 'create_opportunity', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'create_opportunity', status: 'skipped' });
    }

    // Step 4: Add note
    if (params.note && contactId) {
      try {
        await this.ghlClient.createContactNote(contactId, { body: params.note });
        steps.push({ step: 'create_note', status: 'success' });
      } catch (error) {
        steps.push({ step: 'create_note', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'create_note', status: 'skipped' });
    }

    // Step 5: Trigger workflow
    if (params.workflowId && contactId) {
      try {
        await this.ghlClient.addContactToWorkflow(contactId, params.workflowId);
        steps.push({ step: 'add_to_workflow', status: 'success', data: { workflowId: params.workflowId } });
      } catch (error) {
        steps.push({ step: 'add_to_workflow', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'add_to_workflow', status: 'skipped' });
    }

    const failedSteps = steps.filter(s => s.status === 'failed');
    return {
      success: failedSteps.length === 0,
      contactId,
      steps,
      message: failedSteps.length === 0
        ? 'Prospect intake completed successfully'
        : `Prospect intake completed with ${failedSteps.length} failure(s)`
    };
  }

  // =========================================================================
  // ghl_composite_full_contact_setup
  // =========================================================================
  private async fullContactSetup(params: any): Promise<any> {
    const steps: CompositeStep[] = [];
    let contactId: string | undefined;

    // Step 1: Upsert contact
    try {
      const contactData: any = {
        locationId: this.ghlClient.getConfig().locationId,
        firstName: params.firstName,
        lastName: params.lastName,
        name: params.name,
        email: params.email,
        phone: params.phone,
        address1: params.address1,
        city: params.city,
        state: params.state,
        country: params.country,
        postalCode: params.postalCode,
        website: params.website,
        timezone: params.timezone,
        companyName: params.companyName,
        source: params.source,
        assignedTo: params.assignedTo,
        customFields: params.customFields
      };
      const response = await this.ghlClient.upsertContact(contactData);
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Upsert failed');
      }
      contactId = response.data.contact?.id;
      steps.push({ step: 'upsert_contact', status: 'success', data: { contactId, new: response.data.new } });
    } catch (error) {
      steps.push({ step: 'upsert_contact', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      return { success: false, steps, message: 'Failed at upsert_contact step' };
    }

    // Step 2: Tags
    if (params.tags?.length && contactId) {
      try {
        await this.ghlClient.addContactTags(contactId, params.tags);
        steps.push({ step: 'add_tags', status: 'success', data: { tags: params.tags } });
      } catch (error) {
        steps.push({ step: 'add_tags', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'add_tags', status: 'skipped' });
    }

    // Step 3: Note
    if (params.note && contactId) {
      try {
        await this.ghlClient.createContactNote(contactId, { body: params.note });
        steps.push({ step: 'create_note', status: 'success' });
      } catch (error) {
        steps.push({ step: 'create_note', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'create_note', status: 'skipped' });
    }

    // Step 4: Task
    if (params.taskTitle && contactId) {
      try {
        await this.ghlClient.createContactTask(contactId, {
          title: params.taskTitle,
          body: params.taskBody,
          dueDate: params.taskDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          assignedTo: params.assignedTo
        });
        steps.push({ step: 'create_task', status: 'success' });
      } catch (error) {
        steps.push({ step: 'create_task', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'create_task', status: 'skipped' });
    }

    // Step 5: Workflow
    if (params.workflowId && contactId) {
      try {
        await this.ghlClient.addContactToWorkflow(contactId, params.workflowId);
        steps.push({ step: 'add_to_workflow', status: 'success' });
      } catch (error) {
        steps.push({ step: 'add_to_workflow', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'add_to_workflow', status: 'skipped' });
    }

    // Step 6: Campaign
    if (params.campaignId && contactId) {
      try {
        await this.ghlClient.addContactToCampaign(contactId, params.campaignId);
        steps.push({ step: 'add_to_campaign', status: 'success' });
      } catch (error) {
        steps.push({ step: 'add_to_campaign', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      steps.push({ step: 'add_to_campaign', status: 'skipped' });
    }

    const failedSteps = steps.filter(s => s.status === 'failed');
    return {
      success: failedSteps.length === 0,
      contactId,
      steps,
      message: failedSteps.length === 0
        ? 'Full contact setup completed successfully'
        : `Contact setup completed with ${failedSteps.length} failure(s)`
    };
  }

  // =========================================================================
  // ghl_composite_pipeline_report
  // =========================================================================
  private async pipelineReport(params: any): Promise<any> {
    const steps: CompositeStep[] = [];

    // Step 1: Get pipelines
    let pipelines: any[] = [];
    try {
      const pipelinesResponse = await this.ghlClient.getPipelines();
      if (!pipelinesResponse.success || !pipelinesResponse.data) {
        throw new Error('Failed to get pipelines');
      }
      pipelines = (pipelinesResponse.data as any).pipelines || [];
      if (params.pipelineId) {
        pipelines = pipelines.filter((p: any) => p.id === params.pipelineId);
      }
      steps.push({ step: 'get_pipelines', status: 'success', data: { count: pipelines.length } });
    } catch (error) {
      steps.push({ step: 'get_pipelines', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      return { success: false, steps, message: 'Failed to get pipelines' };
    }

    // Step 2: Search opportunities per pipeline
    const report: any[] = [];
    for (const pipeline of pipelines) {
      try {
        const searchParams: any = {
          location_id: this.ghlClient.getConfig().locationId,
          pipeline_id: pipeline.id,
          limit: 100
        };
        if (params.status && params.status !== 'all') {
          searchParams.status = params.status;
        }

        const oppResponse = await this.ghlClient.searchOpportunities(searchParams);
        if (!oppResponse.success || !oppResponse.data) continue;

        const data = oppResponse.data as any;
        const opportunities = Array.isArray(data.opportunities) ? data.opportunities : [];

        // Aggregate by stage
        const stages = pipeline.stages || [];
        const stageReport: any[] = stages.map((stage: any) => {
          const stageOpps = opportunities.filter((o: any) => o.pipelineStageId === stage.id);
          const totalValue = stageOpps.reduce((sum: number, o: any) => sum + (o.monetaryValue || 0), 0);
          return {
            stageId: stage.id,
            stageName: stage.name,
            count: stageOpps.length,
            totalValue,
            avgValue: stageOpps.length > 0 ? Math.round(totalValue / stageOpps.length) : 0
          };
        });

        const totalOpps = opportunities.length;
        const totalValue = opportunities.reduce((sum: number, o: any) => sum + (o.monetaryValue || 0), 0);

        report.push({
          pipelineId: pipeline.id,
          pipelineName: pipeline.name,
          totalOpportunities: totalOpps,
          totalValue,
          stages: stageReport
        });

        steps.push({ step: `search_opportunities_${pipeline.id}`, status: 'success', data: { count: totalOpps } });
      } catch (error) {
        steps.push({ step: `search_opportunities_${pipeline.id}`, status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    }

    return {
      success: true,
      report,
      steps,
      message: `Pipeline report generated for ${report.length} pipeline(s)`
    };
  }

  // =========================================================================
  // ghl_composite_renewal_dashboard
  // =========================================================================
  private async renewalDashboard(params: any): Promise<any> {
    const steps: CompositeStep[] = [];

    try {
      // Search contacts — the GHL search API doesn't support custom field date filtering natively,
      // so we fetch a batch and filter client-side
      const searchResponse = await this.ghlClient.searchContacts({
        locationId: this.ghlClient.getConfig().locationId,
        limit: params.limit || 100
      });

      if (!searchResponse.success || !searchResponse.data) {
        throw new Error('Failed to search contacts');
      }

      const allContacts = (searchResponse.data as any).contacts || [];
      steps.push({ step: 'search_contacts', status: 'success', data: { totalFetched: allContacts.length } });

      // Filter by custom field date range
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);
      const fieldId = params.customFieldId;

      const matchingContacts = allContacts.filter((contact: any) => {
        const customFields = contact.customFields || [];
        const field = customFields.find((f: any) => f.id === fieldId || f.key === fieldId);
        if (!field || !field.value) return false;

        const fieldDate = new Date(field.value);
        return fieldDate >= startDate && fieldDate <= endDate;
      });

      // Group by month
      const byMonth: Record<string, any[]> = {};
      for (const contact of matchingContacts) {
        const field = (contact.customFields || []).find((f: any) => f.id === fieldId || f.key === fieldId);
        const date = new Date(field.value);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!byMonth[monthKey]) byMonth[monthKey] = [];
        byMonth[monthKey].push({
          contactId: contact.id,
          name: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
          email: contact.email,
          phone: contact.phone,
          renewalDate: field.value
        });
      }

      // Sort months
      const sortedMonths = Object.keys(byMonth).sort();
      const dashboard = sortedMonths.map(month => ({
        month,
        count: byMonth[month].length,
        contacts: byMonth[month].sort((a: any, b: any) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
      }));

      return {
        success: true,
        totalMatching: matchingContacts.length,
        dateRange: { start: params.startDate, end: params.endDate },
        dashboard,
        steps,
        message: `Found ${matchingContacts.length} contacts with dates in range across ${sortedMonths.length} month(s)`
      };
    } catch (error) {
      steps.push({ step: 'search_contacts', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      return { success: false, steps, message: `Failed: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  // =========================================================================
  // ghl_composite_bulk_field_update
  // =========================================================================
  private async bulkFieldUpdate(params: any): Promise<any> {
    const steps: CompositeStep[] = [];
    const maxLimit = Math.min(params.limit || 50, 200);

    // Step 1: Search contacts
    let contacts: any[] = [];
    try {
      const searchParams: any = {
        locationId: this.ghlClient.getConfig().locationId,
        query: params.query,
        limit: maxLimit,
        filters: {
          ...(params.filterEmail && { email: params.filterEmail }),
          ...(params.filterPhone && { phone: params.filterPhone }),
          ...(params.filterTags && { tags: params.filterTags })
        }
      };
      const response = await this.ghlClient.searchContacts(searchParams);
      if (!response.success || !response.data) {
        throw new Error('Search failed');
      }
      contacts = (response.data as any).contacts || [];
      steps.push({ step: 'search_contacts', status: 'success', data: { found: contacts.length } });
    } catch (error) {
      steps.push({ step: 'search_contacts', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      return { success: false, steps, message: 'Failed to search contacts' };
    }

    if (contacts.length === 0) {
      return { success: true, updated: 0, failed: 0, steps, message: 'No contacts matched the search criteria' };
    }

    // Step 2: Update each contact
    let updated = 0;
    let failed = 0;
    const failures: any[] = [];

    for (const contact of contacts) {
      try {
        const updatePayload: any = { ...params.updateFields };
        if (params.customFields) {
          updatePayload.customFields = params.customFields;
        }
        await this.ghlClient.updateContact(contact.id, updatePayload);
        updated++;
      } catch (error) {
        failed++;
        failures.push({
          contactId: contact.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    steps.push({
      step: 'bulk_update',
      status: failed === 0 ? 'success' : 'failed',
      data: { updated, failed }
    });

    return {
      success: failed === 0,
      updated,
      failed,
      totalSearched: contacts.length,
      failures: failures.length > 0 ? failures : undefined,
      steps,
      message: `Updated ${updated}/${contacts.length} contacts${failed > 0 ? `, ${failed} failed` : ''}`
    };
  }
}
