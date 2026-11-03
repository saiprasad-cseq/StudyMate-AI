export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let timeOfDay = 'morning';
  if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 || hour < 4) {
    timeOfDay = 'evening';
  }
  return `Good ${timeOfDay}, ${name} 👋`;
}

export function formatTodayDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getLast7DaysLabels(): { dateStr: string; label: string; fullDate: string }[] {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({
      dateStr,
      label,
      fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  return days;
}
