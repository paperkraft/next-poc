import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

// Types
type PincodeEntry = {
    country: string
    district: string
    pincode: number
    state: string
    area: string[]
    code: number
    ut: boolean
    talukas: string[]
}

type PincodeData = Record<string, PincodeEntry>

// Load and parse the JSON file
let pincodeData: PincodeData | null = null

function loadPincodeData(): PincodeData {
    if (pincodeData) return pincodeData

    const filePath = path.join(process.cwd(), 'public', 'pincodes.json')
    const raw = fs.readFileSync(filePath, 'utf8')
    const json = JSON.parse(raw) as Array<Record<string, PincodeEntry>>

    // Flatten the array of single-key objects into one object
    pincodeData = json.reduce((acc, obj) => {
        const [key, value] = Object.entries(obj)[0]
        acc[key] = value
        return acc
    }, {} as PincodeData)

    return pincodeData
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const pincodeParam = searchParams.get('pincode')
    const districtParam = searchParams.get('district')?.toLowerCase()
    const stateParam = searchParams.get('state')?.toLowerCase()
    const areaParam = searchParams.get('area')?.toLowerCase()
    const talukasParam = searchParams.get('taluka')?.toLowerCase()

    // Early return if no valid filters are provided
    if (
        !pincodeParam &&
        !districtParam &&
        !stateParam &&
        !areaParam &&
        !talukasParam
    ) {
        return NextResponse.json(
            { error: 'No matching records found.' },
            { status: 400 }
        )
    }

    const data = loadPincodeData();

    // Exact match by pincode
    if (pincodeParam && data[pincodeParam]) {
        return NextResponse.json(data[pincodeParam])
    }

    // Filter by district/state/area
    let results = Object.entries(data)

    if (districtParam) {
        results = results.filter(([_, value]) => value.district.toLowerCase() === districtParam)
    }

    if (stateParam) {
        results = results.filter(([_, value]) => value.state.toLowerCase() === stateParam)
    }

    if (areaParam) {
        results = results.filter(([_, value]) =>
            value.area.some((a: string) => a.toLowerCase().includes(areaParam))
        )
    }
    if (talukasParam) {
        results = results.filter(([_, value]) =>
            value.talukas.some((a: string) => a.toLowerCase().includes(talukasParam))
        )
    }

    if (results.length === 0) {
        return NextResponse.json({ error: 'No matching records found.' }, { status: 404 })
    }

    const filtered = Object.fromEntries(results)
    return NextResponse.json(filtered)
}