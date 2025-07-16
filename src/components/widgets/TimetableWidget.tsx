export default function TimetableWidget() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  return (
    <div className="p-3">
      <h4 className="font-medium mb-3">Today's Schedule</h4>
      <div className="space-y-2">
        {days.map(day => (
          <div key={day} className="flex items-center gap-3 p-2 border-b">
            <span className="font-medium w-10">{day}</span>
            <span className="text-sm">9:00 AM - Math</span>
          </div>
        ))}
      </div>
    </div>
  )
}