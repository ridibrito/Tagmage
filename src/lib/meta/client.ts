import { decrypt } from '@/lib/crypto'

export interface MetaClientOptions {
  accessToken: string
}

export class MetaClient {
  private accessToken: string
  private baseUrl = 'https://graph.facebook.com/v18.0'

  constructor(options: MetaClientOptions) {
    this.accessToken = options.accessToken
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const queryParams = new URLSearchParams({
      access_token: this.accessToken,
      ...params,
    })

    const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Meta API error')
    }

    return response.json()
  }

  async getBusinesses(): Promise<any[]> {
    const response = await this.request<{ data: any[] }>('/me/businesses', {
      fields: 'id,name',
    })
    return response.data || []
  }

  async getAdAccounts(businessId?: string): Promise<any[]> {
    if (businessId) {
      const response = await this.request<{ data: any[] }>(
        `/businesses/${businessId}/owned_ad_accounts`,
        {
          fields: 'id,name,account_id,currency,timezone,account_status',
        }
      )
      return response.data || []
    }

    // Fallback: buscar contas diretamente
    const response = await this.request<{ data: any[] }>('/me/adaccounts', {
      fields: 'id,name,account_id,currency,timezone,account_status',
    })
    return response.data || []
  }

  async getCampaigns(accountId: string, fields: string[] = ['id', 'name', 'objective', 'status', 'start_time', 'stop_time']): Promise<any[]> {
    const response = await this.request<{ data: any[] }>(
      `/${accountId}/campaigns`,
      {
        fields: fields.join(','),
        limit: '1000',
      }
    )
    return response.data || []
  }

  async getAdSets(accountId: string, campaignId?: string): Promise<any[]> {
    const params: Record<string, string> = {
      fields: 'id,name,campaign_id,optimization_goal,daily_budget,status,start_time,end_time',
      limit: '1000',
    }

    if (campaignId) {
      params['filtering'] = JSON.stringify([{ field: 'campaign.id', operator: 'EQUAL', value: campaignId }])
    }

    const response = await this.request<{ data: any[] }>(
      `/${accountId}/adsets`,
      params
    )
    return response.data || []
  }

  async getAds(accountId: string, adsetId?: string): Promise<any[]> {
    const params: Record<string, string> = {
      fields: 'id,name,adset_id,status',
      limit: '1000',
    }

    if (adsetId) {
      params['filtering'] = JSON.stringify([{ field: 'adset.id', operator: 'EQUAL', value: adsetId }])
    }

    const response = await this.request<{ data: any[] }>(
      `/${accountId}/ads`,
      params
    )
    return response.data || []
  }

  async getInsights(
    level: 'account' | 'campaign' | 'adset' | 'ad',
    accountId: string,
    timeRange: { since: string; until: string },
    fields: string[] = [
      'spend',
      'impressions',
      'clicks',
      'reach',
      'actions',
      'action_values',
      'objective',
    ],
    timeIncrement?: '1' | 'all_days'
  ): Promise<any[]> {
    const params: Record<string, string> = {
      fields: fields.join(','),
      time_range: JSON.stringify(timeRange),
      limit: '100',
    }

    if (timeIncrement) {
      params.time_increment = timeIncrement
    }

    let endpoint = `/${accountId}/insights`
    if (level !== 'account') {
      endpoint = `/${accountId}/${level}s/insights`
    }

    const allInsights: any[] = []
    let after: string | undefined = undefined

    do {
      if (after) {
        params.after = after
      }

      const response = await this.request<{ data: any[]; paging?: { cursors?: { after?: string } } }>(endpoint, params)
      
      if (response.data) {
        allInsights.push(...response.data)
      }

      after = response.paging?.cursors?.after
    } while (after && allInsights.length < 10000) // Limite de segurança

    return allInsights
  }
}

export async function createMetaClientFromConnection(
  connectionData: {
    access_token_encrypted: string
  }
): Promise<MetaClient> {
  const accessToken = decrypt(connectionData.access_token_encrypted)
  return new MetaClient({ accessToken })
}

