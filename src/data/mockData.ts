// ============================================================
// TYPES
// ============================================================

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
}

export interface Group {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  cardBorder: string;
  themeColor: string;
  balance: number;
  cap: number;
  members: Member[];
  spentThisMonth: number;
  category: string;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'contribution' | 'request';
  personName: string;
  personAvatar: string;
  groupName: string;
  amount: number;
  timeAgo: string;
  status: 'success' | 'add';
}

export interface Notification {
  id: string;
  type: 'approval' | 'payment' | 'contribution' | 'info';
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
}

export interface ApprovalRequest {
  id: string;
  groupId: string;
  groupName: string;
  requestedBy: string;
  requestedByAvatar: string;
  merchant: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalsNeeded: number;
  approvalsGiven: string[];
  createdAt: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const AVATARS = {
  mrunali: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
  aarav: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  priya: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  nikhil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  sneha: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
  vikram: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=faces',
};

export const CURRENT_USER = {
  id: 'u1',
  name: 'Mrunali',
  fullName: 'Mrunali Patil',
  phone: '+91 98765 43210',
  avatar: AVATARS.mrunali,
  personalBalance: 3250,
  upiId: 'mrunali@upi',
  kycStatus: 'verified' as const,
};

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Flatmates',
    icon: 'flatmates',
    iconBg: '#2563EB',
    iconColor: '#FFFFFF',
    cardBg: '#DBEAFE',
    cardBorder: '#93C5FD',
    themeColor: '#2563EB',
    balance: 6480,
    cap: 10000,
    members: [
      { id: 'm1', name: 'Mrunali', avatar: AVATARS.mrunali, role: 'admin' },
      { id: 'm2', name: 'Aarav', avatar: AVATARS.aarav, role: 'member' },
      { id: 'm3', name: 'Priya', avatar: AVATARS.priya, role: 'member' },
      { id: 'm4', name: 'Nikhil', avatar: AVATARS.nikhil, role: 'member' },
    ],
    spentThisMonth: 1240,
    category: 'rent',
  },
  {
    id: 'g2',
    name: 'Ganpati Group',
    icon: 'ganpati',
    iconBg: '#7C3AED',
    iconColor: '#FFFFFF',
    cardBg: '#EDE9FE',
    cardBorder: '#C4B5FD',
    themeColor: '#7C3AED',
    balance: 3200,
    cap: 5000,
    members: [
      { id: 'm1', name: 'Mrunali', avatar: AVATARS.mrunali, role: 'admin' },
      { id: 'm2', name: 'Aarav', avatar: AVATARS.aarav, role: 'member' },
      { id: 'm3', name: 'Priya', avatar: AVATARS.priya, role: 'member' },
      { id: 'm4', name: 'Nikhil', avatar: AVATARS.nikhil, role: 'member' },
      { id: 'm5', name: 'Sneha', avatar: AVATARS.sneha, role: 'member' },
      { id: 'm6', name: 'Vikram', avatar: AVATARS.vikram, role: 'member' },
    ],
    spentThisMonth: 820,
    category: 'events',
  },
  {
    id: 'g3',
    name: 'Weekend Group',
    icon: 'weekend',
    iconBg: '#0D9488',
    iconColor: '#FFFFFF',
    cardBg: '#CCFBF1',
    cardBorder: '#5EEAD4',
    themeColor: '#0D9488',
    balance: 2350,
    cap: 5000,
    members: [
      { id: 'm1', name: 'Mrunali', avatar: AVATARS.mrunali, role: 'member' },
      { id: 'm2', name: 'Aarav', avatar: AVATARS.aarav, role: 'admin' },
      { id: 'm3', name: 'Priya', avatar: AVATARS.priya, role: 'member' },
      { id: 'm4', name: 'Nikhil', avatar: AVATARS.nikhil, role: 'member' },
      { id: 'm5', name: 'Sneha', avatar: AVATARS.sneha, role: 'member' },
    ],
    spentThisMonth: 560,
    category: 'trip',
  },
  {
    id: 'g4',
    name: 'Office Lunch',
    icon: 'dining',
    iconBg: '#F59E0B',
    iconColor: '#FFFFFF',
    cardBg: '#FEF3C7',
    cardBorder: '#FCD34D',
    themeColor: '#F59E0B',
    balance: 1800,
    cap: 3000,
    members: [
      { id: 'm1', name: 'Mrunali', avatar: AVATARS.mrunali, role: 'member' },
      { id: 'm2', name: 'Aarav', avatar: AVATARS.aarav, role: 'admin' },
      { id: 'm3', name: 'Priya', avatar: AVATARS.priya, role: 'member' },
    ],
    spentThisMonth: 420,
    category: 'dining',
  },
];

export const MOCK_RECENT_ACTIVITY: Transaction[] = [
  {
    id: 't1',
    type: 'payment',
    personName: 'Aarav',
    personAvatar: AVATARS.aarav,
    groupName: 'Flatmates',
    amount: 480,
    timeAgo: '2 hours ago',
    status: 'success',
  },
  {
    id: 't2',
    type: 'contribution',
    personName: 'You',
    personAvatar: AVATARS.mrunali,
    groupName: 'Weekend Group',
    amount: 2000,
    timeAgo: '5 hours ago',
    status: 'add',
  },
  {
    id: 't3',
    type: 'payment',
    personName: 'Nikhil',
    personAvatar: AVATARS.nikhil,
    groupName: 'Ganpati Group',
    amount: 320,
    timeAgo: '8 hours ago',
    status: 'success',
  },
  {
    id: 't4',
    type: 'payment',
    personName: 'Priya',
    personAvatar: AVATARS.priya,
    groupName: 'Office Lunch',
    amount: 650,
    timeAgo: '1 day ago',
    status: 'success',
  },
  {
    id: 't5',
    type: 'contribution',
    personName: 'Sneha',
    personAvatar: AVATARS.sneha,
    groupName: 'Flatmates',
    amount: 1500,
    timeAgo: '2 days ago',
    status: 'add',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'approval', title: 'Approval needed', body: 'Aarav requested ₹1,240 from Flatmates for groceries', timeAgo: '10 mins ago', read: false },
  { id: 'n2', type: 'payment', title: 'Payment successful', body: 'Nikhil paid ₹320 to Ganpati Group wallet', timeAgo: '8 hours ago', read: false },
  { id: 'n3', type: 'contribution', title: 'New contribution', body: 'You added ₹2,000 to Weekend Group', timeAgo: '5 hours ago', read: true },
  { id: 'n4', type: 'info', title: 'Group created', body: 'You created "Weekend Group" successfully', timeAgo: '3 days ago', read: true },
  { id: 'n5', type: 'approval', title: 'Request approved', body: 'Your ₹480 request was approved by Flatmates', timeAgo: '1 day ago', read: true },
];

export const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: 'req1',
    groupId: 'g1',
    groupName: 'Flatmates',
    requestedBy: 'Aarav Sharma',
    requestedByAvatar: AVATARS.aarav,
    merchant: 'D-Mart Hyderabad',
    amount: 1240,
    purpose: 'Monthly groceries – rice, dal, oil and cleaning supplies',
    status: 'pending',
    approvalsNeeded: 2,
    approvalsGiven: ['Aarav Sharma'],
    createdAt: '2026-10-08T10:00:00Z',
  },
  {
    id: 'req2',
    groupId: 'g3',
    groupName: 'Weekend Group',
    requestedBy: 'Priya Mehta',
    requestedByAvatar: AVATARS.priya,
    merchant: 'OYO Rooms',
    amount: 3500,
    purpose: 'Hotel booking for weekend trip – 2 nights',
    status: 'pending',
    approvalsNeeded: 3,
    approvalsGiven: ['Priya Mehta', 'Aarav Sharma'],
    createdAt: '2026-10-07T14:00:00Z',
  },
];

// ============================================================
// PERSONAL PAYMENT HISTORY
// ============================================================

export type PaymentDir = 'paid' | 'received' | 'added';

export interface PersonalPayment {
  id: string;
  groupId: string;
  groupName: string;
  groupIcon: string;
  groupTheme: string;
  groupCardBg: string;
  merchant: string;
  note: string;
  amount: number;
  dir: PaymentDir;          // paid = you paid from group wallet, received = group paid you back, added = you topped up
  date: string;             // display string
  status: 'success' | 'pending' | 'failed';
}

export const MOCK_PERSONAL_PAYMENTS: PersonalPayment[] = [
  // ── Flatmates
  { id: 'pp1', groupId: 'g1', groupName: 'Flatmates', groupIcon: 'flatmates', groupTheme: '#2563EB', groupCardBg: '#DBEAFE',
    merchant: 'D-Mart', note: 'Monthly groceries', amount: 1240, dir: 'paid', date: 'Today, 10:30 AM', status: 'success' },
  { id: 'pp2', groupId: 'g1', groupName: 'Flatmates', groupIcon: 'flatmates', groupTheme: '#2563EB', groupCardBg: '#DBEAFE',
    merchant: 'Wallet Top-up', note: 'Added money to group', amount: 2000, dir: 'added', date: 'Yesterday, 6:00 PM', status: 'success' },
  { id: 'pp3', groupId: 'g1', groupName: 'Flatmates', groupIcon: 'flatmates', groupTheme: '#2563EB', groupCardBg: '#DBEAFE',
    merchant: 'Electricity Bill', note: 'Oct electricity', amount: 760, dir: 'paid', date: 'Oct 6, 9:15 AM', status: 'success' },

  // ── Ganpati Group
  { id: 'pp4', groupId: 'g2', groupName: 'Ganpati Group', groupIcon: 'ganpati', groupTheme: '#7C3AED', groupCardBg: '#EDE9FE',
    merchant: 'Decoration Shop', note: 'Flowers & pooja items', amount: 320, dir: 'paid', date: 'Oct 5, 11:00 AM', status: 'success' },
  { id: 'pp5', groupId: 'g2', groupName: 'Ganpati Group', groupIcon: 'ganpati', groupTheme: '#7C3AED', groupCardBg: '#EDE9FE',
    merchant: 'Wallet Top-up', note: 'Festival fund', amount: 1000, dir: 'added', date: 'Oct 4, 2:00 PM', status: 'success' },

  // ── Weekend Group
  { id: 'pp6', groupId: 'g3', groupName: 'Weekend Group', groupIcon: 'weekend', groupTheme: '#0D9488', groupCardBg: '#CCFBF1',
    merchant: 'OYO Rooms', note: 'Hotel – 2 nights Lonavala', amount: 3500, dir: 'paid', date: 'Oct 3, 4:45 PM', status: 'pending' },
  { id: 'pp7', groupId: 'g3', groupName: 'Weekend Group', groupIcon: 'weekend', groupTheme: '#0D9488', groupCardBg: '#CCFBF1',
    merchant: 'Swiggy', note: 'Group dinner on trip', amount: 840, dir: 'paid', date: 'Oct 2, 8:30 PM', status: 'success' },
  { id: 'pp8', groupId: 'g3', groupName: 'Weekend Group', groupIcon: 'weekend', groupTheme: '#0D9488', groupCardBg: '#CCFBF1',
    merchant: 'Refund', note: 'Trip cancellation refund', amount: 500, dir: 'received', date: 'Oct 1, 12:00 PM', status: 'success' },

  // ── Office Lunch
  { id: 'pp9', groupId: 'g4', groupName: 'Office Lunch', groupIcon: 'dining', groupTheme: '#F59E0B', groupCardBg: '#FEF3C7',
    merchant: 'Zomato', note: 'Team lunch order', amount: 650, dir: 'paid', date: 'Sep 30, 1:15 PM', status: 'success' },
  { id: 'pp10', groupId: 'g4', groupName: 'Office Lunch', groupIcon: 'dining', groupTheme: '#F59E0B', groupCardBg: '#FEF3C7',
    merchant: 'Wallet Top-up', note: 'Oct lunch fund', amount: 800, dir: 'added', date: 'Sep 29, 9:00 AM', status: 'success' },
];

// ============================================================
// HELPERS
// ============================================================

export function formatINR(amount: number): string {
  return '₹' + new Intl.NumberFormat('en-IN').format(amount);
}

export function pct(amount: number, cap: number): number {
  return Math.min(100, Math.round((amount / cap) * 100));
}
