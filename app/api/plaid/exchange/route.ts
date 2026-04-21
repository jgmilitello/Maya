import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { plaidClient } from '@/src/lib/plaid'
import { prisma } from '@/src/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!

  const { public_token, institution } = await req.json()

  try {
    // Exchange public token for access token
    const exchangeRes = await plaidClient.itemPublicTokenExchange({ public_token })
    const { access_token, item_id } = exchangeRes.data

    // Save the item to DB
    await prisma.plaidItem.upsert({
      where: { itemId: item_id },
      update: { accessToken: access_token, institutionName: institution?.name ?? null, institutionId: institution?.institution_id ?? null },
      create: {
        userId,
        itemId: item_id,
        accessToken: access_token,
        institutionName: institution?.name ?? null,
        institutionId: institution?.institution_id ?? null,
      },
    })

    // Fetch and cache accounts
    const accountsRes = await plaidClient.accountsGet({ access_token })
    for (const acct of accountsRes.data.accounts) {
      await prisma.plaidAccount.upsert({
        where: { accountId: acct.account_id },
        update: {
          name: acct.name,
          officialName: acct.official_name ?? null,
          type: acct.type,
          subtype: acct.subtype ?? null,
          mask: acct.mask ?? null,
          currentBalance: acct.balances.current ?? null,
          availableBalance: acct.balances.available ?? null,
        },
        create: {
          plaidItemId: item_id,
          accountId: acct.account_id,
          name: acct.name,
          officialName: acct.official_name ?? null,
          type: acct.type,
          subtype: acct.subtype ?? null,
          mask: acct.mask ?? null,
          currentBalance: acct.balances.current ?? null,
          availableBalance: acct.balances.available ?? null,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Plaid exchange error:', err)
    return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 })
  }
}
