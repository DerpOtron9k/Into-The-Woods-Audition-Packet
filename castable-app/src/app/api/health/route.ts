import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/database'

export async function GET() {
  try {
    const health = await checkDatabaseHealth()
    
    // Convert BigInt to string for JSON serialization
    const serializedHealth = {
      ...health,
      result: health.result ? JSON.parse(JSON.stringify(health.result, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )) : null
    }
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: serializedHealth,
      note: 'Using real Supabase PostgreSQL - PRD compliant'
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 }
    )
  }
}