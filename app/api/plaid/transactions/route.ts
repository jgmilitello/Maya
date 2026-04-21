import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { plaidClient } from '@/src/lib/plaid'
import { prisma } from '@/src/lib/prisma'

// Map Plaid categories to our budget categories
function mapCategory(plaidCategories: string[] | null | undefined): string {
  if (!plaidCategories || plaidCategories.length === 0) return 'Shopping'
  const top = plaidCategories[0]?.toLowerCase() ?? ''
  const sub = plaidCategories[1]?.toLowerCase() ?? ''

  if (top.includes('food') || sub.includes('groceries') || sub.includes('supermarket')) return 'Groceries'
  if (top.includes('food') || sub.includes('restaurant') || sub.includes('fast food') || sub.includes('coffee')) return 'Dining'
  if (top.includes('travel') && sub.includes('gas')) return 'Gas'
  if (top.includes('travel') || sub.includes('airlines') || sub.includes('hotel')) return 'Travel'
  if (top.includes('transportation') || sub.includes('uber') || sub.includes('lyft') || sub.includes('taxi')) return 'Transportation'
  if (top.includes('recreation') || sub.includes('entertainment') || sub.includes('movies')) return 'Entertainment'
  if (top.includes('healthcare') || sub.includes('pharmacy') || sub.includes('doctor')) return 'Health'
  if (sub.includes('subscription') || sub.includes('streaming') || sub.includes('software')) return 'Subscriptions'
  if (top.includes('utilities') || sub.includes('electric') || sub.includes('internet') || sub.includes('phone')) return 'Bills & Utilities'
  if (top.includes('shops') || top.includes('retail')) return 'Shopping'
  return 'Shopping'
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '30')

  const items = await prisma.plaidItem.findMany({ where: { userId } })
  if (items.length === 0) return NextResponse.json({ transactions: [], connected: false })

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const allTransactions = []
  for (const item of items) {
    try {
      const res = await plaidClient.transactionsGet({
        access_token: item.accessToken,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      })

      for (const txn of res.data.transactions) {
        if (txn.pending) continue // skip pending
        allTransactions.push({
          id: txn.transaction_id,
          date: txn.date,
          description: txn.merchant_name ?? txn.name,
          amount: Math.abs(txn.amount),
          category: txn.amount < 0 ? 'Income' : mapCategory(txn.category),
          type: txn.amount < 0 ? 'income' : 'expense',
          institutionName: item.institutionName,
          accountId: txn.account_id,
        })
      }
    } catch (err) {
      console.error(`Failed to fetch transactions for item ${item.id}:`, err)
    }
  }

  // Also save new transactions to DB for the user
  for (const txn of allTransactions) {
    await prisma.transaction.upsert({
      where: { id: txn.id },
      update: {},
      create: {
        id: txn.id,
        userId,
        amount: txn.amount,
        category: txn.category,
        description: txn.description,
        date: new Date(txn.date),
        type: txn.type,
      },
    })
  }

  return NextResponse.json({ transactions: allTransactions, connected: true })
}
