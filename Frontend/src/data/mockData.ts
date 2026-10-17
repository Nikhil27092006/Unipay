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
  status: 'active' | 'suspended' | 'terminated';
  activeMemberCount: number;
  latestMessage: {
    sender: string;
    text: string;
    time: string;
  };
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

export interface Contact {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  avatar: string;
  bankName: string;
  isRecent?: boolean;
}

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Aarav Sharma', phone: '+91 98201 44521', upiId: 'aarav@okhdfc', avatar: AVATARS.aarav, bankName: 'HDFC Bank', isRecent: true },
  { id: 'c2', name: 'Priya Patel', phone: '+91 98450 11234', upiId: 'priya@oksbi', avatar: AVATARS.priya, bankName: 'State Bank of India', isRecent: true },
  { id: 'c3', name: 'Nikhil Singh', phone: '+91 99302 88471', upiId: 'nikhil@axis', avatar: AVATARS.nikhil, bankName: 'Axis Bank', isRecent: true },
  { id: 'c4', name: 'Sneha Kulkarni', phone: '+91 98111 67230', upiId: 'sneha@icici', avatar: AVATARS.sneha, bankName: 'ICICI Bank', isRecent: true },
  { id: 'c5', name: 'Vikram Malhotra', phone: '+91 98765 12098', upiId: 'vikram@paytm', avatar: AVATARS.vikram, bankName: 'Paytm Payments Bank', isRecent: true },
  { id: 'c6', name: 'Ananya Verma', phone: '+91 97654 32109', upiId: 'ananya@ybl', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', bankName: 'Yes Bank' },
  { id: 'c7', name: 'Rohan Gupta', phone: '+91 98220 54321', upiId: 'rohan@kotak', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces', bankName: 'Kotak Mahindra' },
  { id: 'c8', name: 'Tanvi Joshi', phone: '+91 98334 90123', upiId: 'tanvi@ibl', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', bankName: 'IndusInd Bank' },
];

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
    status: 'active',
    activeMemberCount: 4,
    latestMessage: { sender: 'Aarav', text: 'Can someone pick up groceries on the way?', time: '10:42 AM' },
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
    status: 'active',
    activeMemberCount: 6,
    latestMessage: { sender: 'Priya', text: 'The decorations are arriving tomorrow.', time: 'Yesterday' },
    icon: 'ganpati',
    iconBg: '#1D4ED8',
    iconColor: '#FFFFFF',
    cardBg: '#DBEAFE',
    cardBorder: '#93C5FD',
    themeColor: '#1D4ED8',
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
    status: 'terminated',
    activeMemberCount: 0,
    latestMessage: { sender: 'Nikhil', text: 'Let us plan this again soon.', time: 'Mon' },
    icon: 'weekend',
    iconBg: '#60A5FA',
    iconColor: '#FFFFFF',
    cardBg: '#EFF6FF',
    cardBorder: '#BFDBFE',
    themeColor: '#60A5FA',
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
    status: 'terminated',
    activeMemberCount: 0,
    latestMessage: { sender: 'Mrunali', text: 'This group has been closed.', time: 'Oct 4' },
    icon: 'dining',
    iconBg: '#1D4ED8',
    iconColor: '#FFFFFF',
    cardBg: '#DBEAFE',
    cardBorder: '#93C5FD',
    themeColor: '#1D4ED8',
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
  groupId?: string;
  groupName?: string;
  groupIcon?: string;
  groupTheme?: string;
  groupCardBg?: string;
  merchant: string;
  note: string;
  amount: number;
  dir: PaymentDir;          // paid = debited, received = credited, added = topped up
  date: string;             // display string
  status: 'success' | 'pending' | 'failed';
  upiRef?: string;
  account?: string;
  paymentMode?: 'UPI ID' | 'QR Code' | 'Mobile Number' | 'UPI Lite';
  category?: string;
}

export const MOCK_PERSONAL_PAYMENTS: PersonalPayment[] = [
  // ── Direct Personal UPI Payments
  {
    id: 'upi_1',
    merchant: 'Swiggy Gourmet',
    note: 'Dinner with friends',
    amount: 420,
    dir: 'paid',
    date: 'Today, 1:15 PM',
    status: 'success',
    upiRef: '4291829104',
    account: 'HDFC Bank •••• 4921',
    paymentMode: 'QR Code',
    category: 'Food',
  },
  {
    id: 'upi_2',
    merchant: 'Aarav Sharma',
    note: 'Movie ticket share',
    amount: 850,
    dir: 'paid',
    date: 'Today, 11:30 AM',
    status: 'success',
    upiRef: '4291038102',
    account: 'HDFC Bank •••• 4921',
    paymentMode: 'UPI ID',
    category: 'Transfer',
  },
  {
    id: 'upi_3',
    merchant: 'Priya Patel',
    note: 'Cab share received',
    amount: 1200,
    dir: 'received',
    date: 'Yesterday, 9:20 PM',
    status: 'success',
    upiRef: '4289104928',
    account: 'HDFC Bank •••• 4921',
    paymentMode: 'UPI ID',
    category: 'Settlement',
  },
  {
    id: 'upi_4',
    merchant: 'Starbucks Coffee',
    note: 'Cold brew & croissant',
    amount: 345,
    dir: 'paid',
    date: 'Yesterday, 4:40 PM',
    status: 'success',
    upiRef: '4288194012',
    account: 'UPI Lite',
    paymentMode: 'UPI Lite',
    category: 'Cafes',
  },
  {
    id: 'upi_5',
    merchant: 'Tata Power / Adani',
    note: 'Monthly electricity bill',
    amount: 1850,
    dir: 'paid',
    date: '5 Oct 2026, 10:10 AM',
    status: 'success',
    upiRef: '4281903819',
    account: 'HDFC Bank •••• 4921',
    paymentMode: 'QR Code',
    category: 'Utilities',
  },
  {
    id: 'upi_6',
    merchant: 'Sneha Kulkarni',
    note: 'Dinner split reimbursement',
    amount: 600,
    dir: 'received',
    date: '4 Oct 2026, 6:00 PM',
    status: 'success',
    upiRef: '4279184019',
    account: 'HDFC Bank •••• 4921',
    paymentMode: 'Mobile Number',
    category: 'Reimbursement',
  },
  {
    id: 'upi_7',
    merchant: 'D-Mart Supermarket',
    note: 'Weekly essentials & snacks',
    amount: 1240,
    dir: 'paid',
    date: '3 Oct 2026, 7:15 PM',
    status: 'success',
    upiRef: '4271893018',
    account: 'HDFC Bank •••• 4921',
    paymentMode: 'QR Code',
    category: 'Groceries',
  },
  {
    id: 'upi_8',
    merchant: 'Freelance Design Retainer',
    note: 'Mobile UI sprint payout',
    amount: 14500,
    dir: 'received',
    date: '28 Sep 2026, 11:00 AM',
    status: 'success',
    upiRef: '4259182019',
    account: 'HDFC Bank •••• 4921',
    paymentMode: 'UPI ID',
    category: 'Income',
  },

  // ── Group Wallet Linked Personal Transactions
  { id: 'pp1', groupId: 'g1', groupName: 'Flatmates', groupIcon: 'flatmates', groupTheme: '#2563EB', groupCardBg: '#DBEAFE',
    merchant: 'D-Mart', note: 'Monthly groceries', amount: 1240, dir: 'paid', date: 'Today, 10:30 PM', status: 'success', account: 'Flatmates Vault', upiRef: '4291881023', category: 'Groceries' },
  { id: 'pp2', groupId: 'g1', groupName: 'Flatmates', groupIcon: 'flatmates', groupTheme: '#2563EB', groupCardBg: '#DBEAFE',
    merchant: 'Wallet Top-up', note: 'Added money to group', amount: 2000, dir: 'added', date: 'Yesterday, 6:00 PM', status: 'success', account: 'HDFC Bank •••• 4921', upiRef: '4291772019', category: 'Deposit' },
  { id: 'pp3', groupId: 'g1', groupName: 'Flatmates', groupIcon: 'flatmates', groupTheme: '#2563EB', groupCardBg: '#DBEAFE',
    merchant: 'Electricity Bill', note: 'Oct electricity', amount: 760, dir: 'paid', date: 'Oct 6, 9:15 AM', status: 'success', account: 'Flatmates Vault', upiRef: '4291663012', category: 'Bills' },
  { id: 'pp4', groupId: 'g2', groupName: 'Ganpati Group', groupIcon: 'ganpati', groupTheme: '#1D4ED8', groupCardBg: '#DBEAFE',
    merchant: 'Decoration Shop', note: 'Flowers & pooja items', amount: 320, dir: 'paid', date: 'Oct 5, 11:00 AM', status: 'success', account: 'Ganpati Vault', upiRef: '4291554011', category: 'Festival' },
  { id: 'pp5', groupId: 'g2', groupName: 'Ganpati Group', groupIcon: 'ganpati', groupTheme: '#1D4ED8', groupCardBg: '#DBEAFE',
    merchant: 'Wallet Top-up', note: 'Festival fund', amount: 1000, dir: 'added', date: 'Oct 4, 2:00 PM', status: 'success', account: 'HDFC Bank •••• 4921', upiRef: '4291445010', category: 'Deposit' },
  { id: 'pp6', groupId: 'g3', groupName: 'Weekend Group', groupIcon: 'weekend', groupTheme: '#60A5FA', groupCardBg: '#EFF6FF',
    merchant: 'OYO Rooms', note: 'Hotel – 2 nights Lonavala', amount: 3500, dir: 'paid', date: 'Oct 3, 4:45 PM', status: 'pending', account: 'Weekend Vault', upiRef: '4291336015', category: 'Travel' },
  { id: 'pp7', groupId: 'g3', groupName: 'Weekend Group', groupIcon: 'weekend', groupTheme: '#60A5FA', groupCardBg: '#EFF6FF',
    merchant: 'Swiggy', note: 'Group dinner on trip', amount: 840, dir: 'paid', date: 'Oct 2, 8:30 PM', status: 'success', account: 'Weekend Vault', upiRef: '4291227014', category: 'Food' },
  { id: 'pp8', groupId: 'g3', groupName: 'Weekend Group', groupIcon: 'weekend', groupTheme: '#60A5FA', groupCardBg: '#EFF6FF',
    merchant: 'Refund', note: 'Trip cancellation refund', amount: 500, dir: 'received', date: 'Oct 1, 12:00 PM', status: 'success', account: 'Weekend Vault', upiRef: '4291118018', category: 'Refund' },
  { id: 'pp9', groupId: 'g4', groupName: 'Office Lunch', groupIcon: 'dining', groupTheme: '#1D4ED8', groupCardBg: '#DBEAFE',
    merchant: 'Zomato', note: 'Team lunch order', amount: 650, dir: 'paid', date: 'Sep 30, 1:15 PM', status: 'success', account: 'Lunch Vault', upiRef: '4291009017', category: 'Food' },
  { id: 'pp10', groupId: 'g4', groupName: 'Office Lunch', groupIcon: 'dining', groupTheme: '#1D4ED8', groupCardBg: '#DBEAFE',
    merchant: 'Wallet Top-up', note: 'Oct lunch fund', amount: 800, dir: 'added', date: 'Sep 29, 9:00 AM', status: 'success', account: 'HDFC Bank •••• 4921', upiRef: '4290991016', category: 'Deposit' },
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
