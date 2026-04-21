import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { plaidClient } from '@/src/lib/plaid'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!

  const items = await prisma.plaidItem.findMany({ where: { userId } })
  if (items.length === 0) return NextResponse.json({ accounts: [], items: [] })

  const allAccounts = []
  for (const item of items) {
    try {
      const res = await plaidClient.accountsGet({ access_token: item.accessToken })
      for (const acct of res.data.accounts) {
        // Update cached balances
        await prisma.plaidAccount.upsert({
          where: { accountId: acct.account_id },
          update: { currentBalance: acct.balances.current ?? null, availableBalance: acct.balances.available ?? null },
          create: {
            plaidItemId: item.itemId,
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
        allAccounts.push({ ...acct, institutionName: item.institutionName })
      }
    } catch (err) {
      console.error(`Failed to fetch accounts for item ${item.id}:`, err)
    }
  }

  return NextResponse.json({
    accounts: allAccounts,
    items: items.map(i => ({ id: i.id, institutionName: i.institutionName, createdAt: i.createdAt })),
  })
}

export async function DELETE() {
  // Disconnect all accounts for the user
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!

  await prisma.plaidItem.deleteMany({ where: { userId } })
  return NextResponse.json({ success: true })
}
