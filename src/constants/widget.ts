export const DEFAULT_WIDGETS = [
    {
        id: '1',
        key: 'STATS',
        name: 'Statistics',
        component: 'StatsWidget',
        description: 'Key metrics and numbers',
        category: 'analytics'
    },
    {
        id: '2',
        key: 'TIMETABLE',
        name: 'Time Table',
        component: 'TimetableWidget',
        description: 'Class schedule',
        category: 'organization'
    },
    {
        id: '3',
        key: 'ASSIGNMENTS',
        name: 'Assignments',
        component: 'AssignmentsWidget',
        description: 'Assignments',
        category: 'organization'
    },
    {
        id: '4',
        key: 'NOTICES',
        name: 'Notices',
        component: 'NoticesWidget',
        description: 'Notification',
        category: 'organization'
    }
] as const