import * as Lucide from 'lucide-react';
const icons = ['MapPin', 'Building2', 'Calendar', 'FileText', 'X', 'ChevronRight', 'CheckCircle2', 'Download', 'Phone', 'Mail', 'User', 'Info', 'Sparkles', 'Image'];
icons.forEach(icon => {
  console.log(`${icon} exists:`, !!Lucide[icon]);
});
