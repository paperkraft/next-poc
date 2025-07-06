export default function AssignmentsWidget() {
  const assignments = [
    { id: 1, name: 'Math Homework', due: 'Tomorrow' },
    { id: 2, name: 'Science Project', due: 'Friday' }
  ]

  return (
    <div className="p-3">
      <h4 className="font-medium mb-3">Pending Assignments</h4>
      <ul className="space-y-2">
        {assignments.map(assignment => (
          <li key={assignment.id} className="flex justify-between">
            <span>{assignment.name}</span>
            <span className="text-sm text-orange-500">{assignment.due}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}