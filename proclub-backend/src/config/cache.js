export const CACHE_KEYS = {
  DASHBOARD_ADMIN: 'dashboard:admin',
  DASHBOARD_MEMBER: 'dashboard:member',

  COURSE_LIST: 'courses:list',
  COURSE_DETAIL: 'course:detail',
  COURSE_MODULES: 'course:modules',

  MODULE_LIST: 'module:list',

  LESSON_LIST: 'lesson:list',
  LESSON_DETAIL: 'lesson:detail',

  UPCOMING_EVENTS: 'events:upcoming',

  NOTIFICATIONS: 'notifications'
}

export const CACHE_TTL = {
  DASHBOARD: 300,
  COURSE: 600,
  EVENT: 300,
  NOTIFICATION: 120,
  LESSON: 600
}