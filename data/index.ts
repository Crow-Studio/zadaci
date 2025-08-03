export const faqData = {
  'Tasks': [
    {
      question: 'How do I create a new task?',
      answer: 'Go to your project dashboard, click "Create Task", enter the name, prority, status, description, and set deadlines. You can also assign team members.',
    },
    {
      question: 'How do I mark a task as completed?',
      answer: 'Drag and drop to the Completed column or open the task, set status as "Completed". The system records who completed it and notifies team members.',
    },
    {
      question: 'Can I assign tasks to multiple members?',
      answer: 'Yes. During creation or edit, select multiple users to assign.',
    },
    {
      question: 'How do I track task progress?',
      answer: 'Use the visual kanban board inside each project.',
    },
    {
      question: 'What happens when a task is overdue?',
      answer: 'It\'s highlighted in red, and automatic reminders are sent to assignees.',
    },
  ],
  'Projects': [
    {
      question: 'What is a project in Zadaci?',
      answer: 'A project is a collection of related tasks grouped under a single goal or topic. Each project has its own dashboard, timeline, and members.',
    },
    {
      question: 'Can a task belong to multiple projects?',
      answer: 'No, each task belongs to a single project but can have multiple subtasks and team members.',
    },
  ],
  'Subtasks': [
    {
      question: 'How do subtasks work?',
      answer: 'Subtasks break a large task into smaller pieces. They inherit due dates and status from the parent but can be checked off individually.',
    },
    {
      question: 'Can I assign different people to subtasks?',
      answer: 'Yes. Each subtask can be assigned to a separate user.',
    },
    {
      question: 'What happens when all subtasks are done?',
      answer: 'The parent task status changes to "Ready for Completion" but must be manually marked complete.',
    },
  ],
  'Members': [
    {
      question: 'How do I invite someone to my team?',
      answer: 'Go to your workspace, open the "Members" page, and click "Add user" just at te top of the Members tabs table.',
    },
    {
      question: 'Can I assign roles to users?',
      answer: 'Yes. You can assign roles like Owner, Member, or Guest with different permissions.',
    },
    {
      question: 'Can someone be in multiple teams?',
      answer: 'Yes. A user can be part of many teams across different projects.',
    },
  ],
  'Account & Security': [
    {
      question: 'How do I change my password?',
      answer: 'Go to Account Settings → Security → Change Password.',
    },
    {
      question: 'Does Zadaci support 2FA?',
      answer: 'Yes. You can enable Two-Factor Authentication via passkeys or authenticator apps.',
    },
  ],
}

export const faqsCategories = [
  { icon: 'solar:folder-with-files-outline', name: 'Projects' },
  { icon: 'hugeicons:task-01', name: 'Tasks' },
  { icon: 'hugeicons:task-01', name: 'Subtasks' },
  { icon: 'solar:users-group-two-rounded-outline', name: 'Members' },
  { icon: 'solar:settings-outline', name: 'Account & Security' },
]
