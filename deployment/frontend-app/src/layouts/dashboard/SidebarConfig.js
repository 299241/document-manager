import { Icon } from '@iconify/react';
import dashboardFill from '@iconify/icons-ant-design/dashboard-filled';
import archiveFill from '@iconify/icons-eva/archive-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon(dashboardFill)
  },
  {
    title: 'vault',
    path: '/vault',
    icon: getIcon(archiveFill)
  },
  {
    title: 'drafts',
    path: '/drafts',
    icon: getIcon(fileTextFill)
  }
];

export default sidebarConfig;
