import { db } from "@/db";
import { TestCasesTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const searchparams = new URL(req.url).searchParams;
    const repoId = searchparams.get('repoId');

    if (!repoId) {
        return NextResponse.json({ error: 'repoId is required' }, { status: 400 })
    }

    const result = await db.select().from(TestCasesTable).where(
        eq(TestCasesTable.repoId, repoId)).orderBy(desc(TestCasesTable?.id))

    return NextResponse.json(result)
}