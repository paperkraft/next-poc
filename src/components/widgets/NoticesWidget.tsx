export default function NoticesWidget() {
  const notices = [
    'School closes early Friday',
    'Parent-teacher meetings next week'
  ]

  return (
    <div className="p-3">
      <h4 className="font-medium mb-3">Announcements</h4>
      <ul className="space-y-2 list-disc pl-5">
        {notices.map((notice, index) => (
          <li key={index} className="text-sm">{notice}</li>
        ))}
      </ul>
    </div>
  )
}