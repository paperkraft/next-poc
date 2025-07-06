export default function StatsWidget() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">142</p>
                </div>
                <span className="text-sm text-green-500">↑ 12%</span>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Assignments</p>
                    <p className="text-2xl font-bold">7</p>
                </div>
                <span className="text-sm text-red-500">3 due</span>
            </div>
        </div>
    )
}