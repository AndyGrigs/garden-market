A e-commerce platform for selling garden trees and tools.(in the process of development...)
Role: Full-Stack Developer – building the entire platform including products, shopping cart, and admin dashboard.

Ось короткий опис дерева **павлонія**:

🌿 **Російська (RU):**  
Павлония — быстрорастущее декоративное дерево с крупными листьями и красивыми фиолетовыми цветами. Часто используется для озеленения и производства легкой древесины.

🌿 **Румунська (RO):**  
Paulownia este un arbore ornamental cu creștere rapidă, frunze mari și flori mov spectaculoase. Este apreciat pentru lemnul său ușor și regenerabil.


create me guide how to make the same thing with admin notification
Here's the pattern to follow for refactoring AdminNotifications, based on what we did with AdminCategories and AdminTrees:

Target structure:


src/pages/AdminPanel/AdminNotifications/
├── index.tsx                          # Barrel export
├── components/
│   ├── AdminNotifications.tsx         # Main component (UI state, layout)
│   ├── NotificationList.tsx           # List/grid container
│   ├── NotificationItem.tsx           # Individual notification card
│   └── NotificationModal.tsx          # Modal (if needed)
└── hooks/
    └── useAdminNotifications.ts       # Data logic hook (RTK Query, handlers)
Steps:

Read the existing file src/components/Admin/AdminNotifications.tsx to understand all the logic, state, and RTK Query hooks it uses

Create hooks/useAdminNotifications.ts - extract into it:

All RTK Query hooks (useGet...Query, useMutation calls)
All handler functions (delete, update, mark as read, etc.)
Toast notifications for success/error
Return an object with: data, loading/error states, isProcessing, and handler functions
Create NotificationItem.tsx - extract the JSX that renders a single notification (the <li> or card inside the .map())

Props: notification, onAction, isProcessing, etc.
Create NotificationList.tsx - the list container

Props: notifications[], callbacks, isProcessing
Handles empty state
Maps items to <NotificationItem />
Create AdminNotifications.tsx (main component) - keeps only:

useAdminNotifications() hook call
Modal UI state (useState for open/editing)
Modal open/close/submit handlers
Loading/error early returns
Renders header + <NotificationList /> + <NotificationModal />
Create index.tsx:


export { default } from './components/AdminNotifications';
Update AdminPanel.tsx import:


// from:
const AdminNotifications = lazy(() => import("../components/Admin/AdminNotifications"));
// to:
const AdminNotifications = lazy(() => import("./AdminPanel/AdminNotifications"));
Delete src/components/Admin/AdminNotifications.tsx (and any related modal files)

Run npm run build to verify

Key rules to follow:

The hook handles all data logic (queries, mutations, toasts, confirm dialogs)
The main component handles only UI state (modal open/close, which item is being edited)
List component is a dumb renderer that maps data to items
Item component receives a single item + callbacks as props
If there are separate create/edit modals, merge them into one (like we did with CategoryModal)