
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Workflow, Smartphone, Server, Code, Users, Package, TrendingUp, Download } from 'lucide-react';

// Reusable component for code blocks
const CodeBlock = ({ children }) => (
  <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto text-sm my-4">
    <code>{children}</code>
  </pre>
);

// Reusable component for documentation sections
const DocSection = ({ title, icon: Icon, children }) => (
  <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-slate-700 prose prose-slate max-w-none">
      {children}
    </CardContent>
  </Card>
);

export default function MobileDeveloperDocs() {
  const handlePDFDownload = () => {
    // Create a new window with printable content
    const printWindow = window.open('', '_blank');
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Gencrest Mobile App Developer Documentation</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
            h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; margin-bottom: 30px; }
            h2 { color: #3730a3; margin-top: 30px; }
            h3 { color: #4338ca; margin-top: 20px; }
            h4 { color: #4f46e5; margin-top: 15px; }
            .code-block { background: #1e293b; color: white; padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; margin: 15px 0; overflow-x: auto; }
            /* Ensure pre and code tags are used inside code-block for proper formatting */
            .code-block pre { white-space: pre-wrap; word-wrap: break-word; } /* For pre-wrap to break long lines */
            .code-block code { display: block; }
            ul { margin-left: 20px; }
            li { margin-bottom: 8px; }
            .section { margin-bottom: 40px; page-break-inside: avoid; }
            @media print { 
              body { margin: 20px; font-size: 12px; }
              .code-block { background: #f1f5f9 !important; color: #334155 !important; border: 1px solid #cbd5e1; }
            }
          </style>
        </head>
        <body>
          <h1>Gencrest Mobile App Developer Documentation</h1>
          <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
          <p>A comprehensive guide for building and maintaining the Gencrest Sales Tracker mobile application.</p>
          
          <div class="section">
            <h2>1. Introduction & Core Architecture</h2>
            <p>This document outlines the technical specifications, component structure, and business logic for the Gencrest mobile app prototype. The application is built as a <strong>React component within the Base44 web app</strong> to simulate a native mobile experience. It's designed to be a high-fidelity prototype that can be directly translated into a React Native application.</p>
            
            <h3>Key Principles:</h3>
            <ul>
              <li><strong>State-Driven UI:</strong> The entire interface reacts to changes in the component's state. There is no direct DOM manipulation.</li>
              <li><strong>Component-Based:</strong> The UI is broken down into logical components, although for this prototype, they are organized into render functions within a single file for simplicity.</li>
              <li><strong>Data Agnostic:</strong> The UI is currently populated with static, hardcoded data for demonstration. The logic is designed to easily swap this with live data fetched from Base44 entities (e.g., Visit, Client, SalesOrder).</li>
            </ul>
          </div>

          <div class="section">
            <h2>2. State Management</h2>
            <p>The application's state is managed using React's useState hooks. Understanding these state variables is key to understanding the app's functionality.</p>
            <div class="code-block"><pre><code>const [selectedRole, setSelectedRole] = useState("mdo");
const [currentScreen, setCurrentScreen] = useState("dashboard");
const [activeSection, setActiveSection] = useState(null);
const [activeVisit, setActiveVisit] = useState(null);</code></pre></div>
            <ul>
              <li><strong>selectedRole:</strong> Switches between 'mdo' and 'tsm' views. This determines which UI components and navigation items are rendered.</li>
              <li><strong>currentScreen:</strong> Controls which main screen is visible within the selected role (e.g., 'dashboard', 'schedule', 'team'). This is managed by the bottom navigation bar.</li>
              <li><strong>activeSection:</strong> Manages the expand/collapse state of various UI cards and sections. Clicking a card sets its unique ID to this state, causing conditional rendering of its details.</li>
              <li><strong>activeVisit:</strong> Holds the data for the visit currently in progress. When this is not null, the ActiveVisitModal is rendered as an overlay.</li>
            </ul>
          </div>

          <div class="section">
            <h2>3. MDO (Market Development Officer) View</h2>
            <h3>3.1 Dashboard (renderMDODashboard)</h3>
            <p>The MDO's landing page. It provides a quick summary of daily tasks and activities.</p>
            <ul>
              <li><strong>Stats Cards:</strong> Simple display cards. Clicking on them toggles the activeSection state to show/hide a more detailed breakdown.</li>
              <li><strong>Next Visit Card:</strong> This card is crucial. It displays the next upcoming visit. It contains three key actions:</li>
              <ul>
                <li><strong>Start Visit:</strong> This does NOT simply expand the card. It sets the activeVisit state, which triggers the ActiveVisitModal.</li>
                <li><strong>Navigate & Call Buttons:</strong> Currently placeholders. In a native app, these would trigger intents to open a maps application or the phone dialer.</li>
              </ul>
            </ul>
            
            <h3>3.2 Schedule & Visit Execution (renderMDOSchedule)</h3>
            <p>This screen displays the MDO's planned visits in a timeline format.</p>
            
            <h4>Visit Card Logic:</h4>
            <ul>
              <li><strong>Status Coloring:</strong> The left border color of a visit card is determined by its status (e.g., green for 'Completed', blue for 'Planned').</li>
              <li><strong>Completed Visit Details:</strong> When a completed visit card (e.g., Metro Distributors) is clicked, activeSection is set. This conditionally renders the detailed view within the card, showing a hardcoded summary, task list, and photo gallery.</li>
            </ul>
            
            <h4>Active Visit Modal (ActiveVisitModal):</h4>
            <p>This is the core of the visit execution flow, triggered by the "Start Visit" button.</p>
            <div class="code-block"><pre><code>const ActiveVisitModal = ({ visit, onClose }) => {
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [tasks, setTasks] = useState(
    visit.tasks.map(task => ({ text: task, completed: false }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);
      const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
      const seconds = String(diff % 60).padStart(2, '0');
      setElapsedTime(minutes + ":" + seconds);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleTaskToggle = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const handleSignature = () => {
    const timestamp = new Date().toLocaleString();
    alert('E-Signature Captured at: ' + timestamp);
  };
};</code></pre></div>
            <ul>
              <li><strong>Timer:</strong> A useEffect hook with setInterval calculates and updates the elapsed time every second.</li>
              <li><strong>Task Checklist:</strong> Manages its own state (tasks) derived from the visit prop. Toggling a checkbox updates this local state.</li>
              <li><strong>E-Signature:</strong> The handleSignature function demonstrates capturing a timestamp. When clicked, it creates a new Date() and formats it into a string to be displayed in an alert. In a real app, this would involve saving the signature image and the timestamp to the Visit entity.</li>
            </ul>
          </div>

          <div class="section">
            <h2>4. TSM (Territory Sales Manager) View</h2>
            <h3>4.1 Team Dashboard (renderTSMTeam)</h3>
            <p>Provides a high-level overview of the TSM's team performance. Currently uses static data.</p>
            
            <h3>4.2 Order Management (renderTSMOrders)</h3>
            <p>This screen demonstrates critical business logic from the proposal document.</p>
            
            <h4>Order Blocking Logic:</h4>
            <p>When the "New Order" button is clicked, a form appears. The core logic resides in the client selection and the subsequent UI state.</p>
            <div class="code-block"><pre><code>// In the Client select dropdown:
&lt;option disabled&gt;Blocked Wholesaler (BLOCKED - Credit Hold)&lt;/option&gt;

// Conditional rendering of the warning:
&lt;div className=&quot;bg-red-50 ...&quot;&gt;
  &lt;AlertTriangle ... /&gt;
  &lt;span ...&gt;Order Blocked&lt;/span&gt;
  &lt;p&gt;Client has exceeded credit limit...&lt;/p&gt;
&lt;/div&gt;

// Disabling the creation button:
&lt;button className=&quot;... opacity-50 cursor-not-allowed&quot;&gt;
  Create Order (Blocked)
&lt;/button&gt;</code></pre></div>
            <ul>
              <li><strong>Client Status:</strong> In a real app, the select options would be populated from the Client entity. Clients with status === 'blocked' or outstanding_balance greater than credit_limit would have the disabled attribute.</li>
              <li><strong>UI Feedback:</strong> When a blocked client is selected (or if the default selected client is blocked), a prominent warning div is shown, and the "Create Order" button is visually disabled with opacity-50 and cursor-not-allowed.</li>
            </ul>
            
            <h3>4.3 Monthly Planning (renderTSMPlanning)</h3>
            <p>This screen reflects the planning and approval workflow.</p>
            
            <h4>Approval Status Logic:</h4>
            <p>The UI for each plan card changes based on its status property.</p>
            <div class="code-block"><pre><code>// Example for a 'Pending Approval' card
&lt;Badge className=&quot;bg-yellow-100 text-yellow-800&quot;&gt;
  &lt;Clock className=&quot;w-3 h-3 mr-1&quot; /&gt; Pending Approval
&lt;/Badge&gt;

// Example for a 'Draft' card
&lt;Badge className=&quot;bg-slate-100 text-slate-800&quot;&gt;
  &lt;Edit className=&quot;w-3 h-3 mr-1&quot; /&gt; Draft
&lt;/Badge&gt;
// Action buttons are also conditionally rendered
&lt;button&gt;Submit for Approval&lt;/button&gt; // Only for drafts</code></pre></div>
            <p>Different Badge components with distinct colors and icons are rendered based on the plan's status ('draft', 'pending_approval', 'approved'). Action buttons are also conditional; for example, "Submit for Approval" only appears for drafts.</p>
          </div>

          <div class="section">
            <h2>5. SKU Liquidation Module (Module 3)</h2>
            <h3>5.1 Implementation Strategy</h3>
            <p>The SKU Liquidation module tracks stock movement from distributors to retailers to farmers.</p>
            <div class="code-block"><pre><code>// Stock flow tracking logic
const trackLiquidation = (distributorId, retailerId, farmerId, skuId, quantity) => {
  // Step 1: Distributor allocates stock to retailer
  updateDistributorStock(distributorId, skuId, -quantity);
  updateRetailerStock(retailerId, skuId, +quantity);
  
  // Step 2: Retailer sells to farmer (actual liquidation)
  updateRetailerStock(retailerId, skuId, -quantity);
  recordActualLiquidation(farmerId, skuId, quantity);
};</code></pre></div>
            
            <h3>5.2 Mobile UI Components</h3>
            <ul>
              <li><strong>Distributor View:</strong> Shows opening inventory, allocated stock, and remaining balance</li>
              <li><strong>Retailer Management:</strong> Track retailer-wise stock distribution with digital signatures</li>
              <li><strong>Liquidation Tracking:</strong> Monitor actual sales to farmers with proof capture</li>
              <li><strong>Real-time Sync:</strong> Offline capability with automatic sync when online</li>
            </ul>
          </div>

          <div class="section">
            <h2>6. Performance & Incentive Module (Module 6)</h2>
            <h3>6.1 Gamification Elements</h3>
            <p>The mobile app includes gamification features to motivate field staff.</p>
            <div class="code-block"><pre><code>// Points calculation logic
const calculatePoints = (activity) => {
  const pointsMap = {
    'visit_completed': 50,
    'order_created': 100,
    'target_achieved': 200,
    'photo_uploaded': 25,
    'signature_captured': 30
  };
  return pointsMap[activity] || 0;
};

// Badge earning logic
const checkBadgeEligibility = (userStats) => {
  const badges = [];
  if (userStats.visits >= 100) badges.push('Century Maker');
  if (userStats.streak >= 7) badges.push('Week Warrior');
  return badges;
};</code></pre></div>
            
            <h3>6.2 Performance Tracking</h3>
            <ul>
              <li><strong>Target vs Achievement:</strong> Visual progress bars and percentage completion</li>
              <li><strong>Leaderboards:</strong> Team rankings with real-time updates</li>
              <li><strong>Incentive Calculation:</strong> Auto-calculated based on performance metrics</li>
              <li><strong>Export for Payroll:</strong> Generate reports for HR/payroll processing</li>
            </ul>
          </div>

          <div class="section">
            <h2>7. Distributor Self-Service Module (Module 5)</h2>
            <h3>7.1 Portal Features</h3>
            <p>2500+ distributors can access their own portal for order and payment tracking.</p>
            <div class="code-block"><pre><code>// Distributor dashboard data structure
const distributorData = {
  orderHistory: [], // Live from NetSuite
  invoiceStatus: [], // Real-time invoice tracking
  creditLimits: {}, // Current credit position
  outstandingBalance: 0, // ODOS summary
  skuWiseHistory: [], // Product-wise order history
  alerts: [] // Automated notifications
};</code></pre></div>
            
            <h3>7.2 Integration Points</h3>
            <ul>
              <li><strong>NetSuite Integration:</strong> Live order and invoice data</li>
              <li><strong>Automated Alerts:</strong> Invoice generation, payment reminders</li>
              <li><strong>Feedback System:</strong> Dropdown-based feedback routing to internal teams</li>
              <li><strong>Credit Management:</strong> Real-time credit limit and outstanding display</li>
            </ul>
          </div>

          <div class="section">
            <h2>8. Key Business Rules Implementation</h2>
            <h3>8.1 Order Blocking System (Module 4)</h3>
            <ul>
              <li><strong>TSM Order Creation:</strong> TSMs can initiate new orders from the 'Team Orders' screen with real-time credit checking</li>
              <li><strong>Visual Warnings:</strong> Red alert boxes appear when clients exceed credit limits or are marked inactive</li>
              <li><strong>Disabled Actions:</strong> Order submission buttons are visually disabled and non-functional for blocked clients</li>
              <li><strong>Status Indicators:</strong> Clear badges show client status (Active, Blocked, Credit Hold, Inactive)</li>
            </ul>

            <h3>8.2 Planning & Approval Workflow (Module 2)</h3>
            <ul>
              <li><strong>Status Tracking:</strong> Plans display color-coded badges (Draft = Grey, Pending = Yellow, Approved = Green)</li>
              <li><strong>Conditional Actions:</strong> Submit for approval, edit drafts, view approval status based on current state</li>
              <li><strong>Hierarchical Approval:</strong> TSM creates → RMM approves → Goes to MDO workflow</li>
              <li><strong>Exception Handling:</strong> If roles are missing, planning shifts one level higher automatically</li>
            </ul>

            <h3>8.3 Hierarchical Permissions & Compliance</h3>
            <ul>
              <li><strong>Role-Based Views:</strong> MDOs focus on visit execution, TSMs on team oversight and planning</li>
              <li><strong>Order Creation Rights:</strong> Only TSMs and above can create orders; MDOs execute visits and plans</li>
              <li><strong>UI-Enforced Compliance:</strong> Business rules enforced through visual cues, not just backend validation</li>
              <li><strong>Geofencing Alerts:</strong> Automatic alerts to managers for route deviations or time violations</li>
            </ul>

            <h3>8.4 Data Integrity & Offline Capability</h3>
            <ul>
              <li><strong>Offline Data Entry:</strong> Full functionality in areas with limited connectivity</li>
              <li><strong>Auto-Sync:</strong> Data syncs automatically when connectivity is restored</li>
              <li><strong>Data Locking:</strong> Transactions lock after confirmation to prevent modifications</li>
              <li><strong>Alert System:</strong> Flags data that fails to sync for more than 3 days</li>
            </ul>
          </div>

          <div class="section">
            <h2>9. Technical Implementation Notes</h2>
            <h3>9.1 State Management Patterns</h3>
            <div class="code-block"><pre><code>// Role-based rendering pattern
const renderContent = () => {
  switch(selectedRole) {
    case 'mdo':
      return renderMDOView();
    case 'tsm':
      return renderTSMView();
    default:
      return renderDefaultView();
  }
};

// Conditional action rendering
const renderActionButtons = (item) => {
  const actions = [];
  
  if (item.status === 'draft' && userRole === 'TSM') {
    actions.push(&lt;button onClick={submitForApproval}&gt;Submit&lt;/button&gt;);
  }
  
  if (item.status === 'pending' && userRole === 'RMM') {
    actions.push(&lt;button onClick={approve}&gt;Approve&lt;/button&gt;);
    actions.push(&lt;button onClick={reject}&gt;Reject&lt;/button&gt;);
  }
  
  return actions;
};</code></pre></div>

            <h3>9.2 Data Flow Architecture</h3>
            <ul>
              <li><strong>Entity Integration:</strong> All static data should be replaced with Base44 entity calls</li>
              <li><strong>Real-time Updates:</strong> Use WebSocket connections for live data updates</li>
              <li><strong>Caching Strategy:</strong> Implement proper caching for offline capability</li>
              <li><strong>Error Handling:</strong> Graceful degradation when services are unavailable</li>
            </ul>

            <h3>9.3 Security Implementation</h3>
            <ul>
              <li><strong>JWT Authentication:</strong> Secure token-based authentication</li>
              <li><strong>Role-Based Access:</strong> UI elements rendered based on user permissions</li>
              <li><strong>Data Encryption:</strong> All sensitive data encrypted in transit and at rest</li>
              <li><strong>Audit Logging:</strong> Complete audit trail for all user actions</li>
            </ul>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Mobile App Developer Documentation</h1>
              <p className="text-lg text-slate-600">A comprehensive guide for building and maintaining the Gencrest Sales Tracker mobile application.</p>
              <p className="text-sm text-slate-500 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
            <Button 
              onClick={handlePDFDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </header>

        <DocSection title="1. Introduction & Core Architecture" icon={Smartphone}>
            <p>
                This document outlines the technical specifications, component structure, and business logic for the Gencrest mobile app prototype. 
                The application is built as a <strong>React component within the Base44 web app</strong> to simulate a native mobile experience. 
                It's designed to be a high-fidelity prototype that can be directly translated into a React Native application.
            </p>
            <h4>Key Principles:</h4>
            <ul>
                <li><strong>State-Driven UI:</strong> The entire interface reacts to changes in the component's state. There is no direct DOM manipulation.</li>
                <li><strong>Component-Based:</strong> The UI is broken down into logical components, although for this prototype, they are organized into render functions within a single file for simplicity.</li>
                <li><strong>Data Agnostic:</strong> The UI is currently populated with static, hardcoded data for demonstration. The logic is designed to easily swap this with live data fetched from Base44 entities (e.g., Visit, Client, SalesOrder).</li>
            </ul>
        </DocSection>

        <DocSection title="2. State Management" icon={Server}>
            <p>The application's state is managed using React's useState hooks. Understanding these state variables is key to understanding the app's functionality.</p>
            <CodeBlock>
{`const [selectedRole, setSelectedRole] = useState("mdo");
const [currentScreen, setCurrentScreen] = useState("dashboard");
const [activeSection, setActiveSection] = useState(null);
const [activeVisit, setActiveVisit] = useState(null);`}
            </CodeBlock>
            <ul>
                <li><code>selectedRole</code>: Switches between 'mdo' and 'tsm' views. This determines which UI components and navigation items are rendered.</li>
                <li><code>currentScreen</code>: Controls which main screen is visible within the selected role (e.g., 'dashboard', 'schedule', 'team'). This is managed by the bottom navigation bar.</li>
                <li><code>activeSection</code>: Manages the expand/collapse state of various UI cards and sections. Clicking a card sets its unique ID to this state, causing conditional rendering of its details.</li>
                <li><code>activeVisit</code>: Holds the data for the visit currently in progress. When this is not null, the ActiveVisitModal is rendered as an overlay.</li>
            </ul>
        </DocSection>
        
        <DocSection title="3. MDO (Market Development Officer) View" icon={Users}>
             <h4>3.1 Dashboard (renderMDODashboard)</h4>
             <p>The MDO's landing page. It provides a quick summary of daily tasks and activities.</p>
             <ul>
                <li><strong>Stats Cards:</strong> Simple display cards. Clicking on them toggles the activeSection state to show/hide a more detailed breakdown.</li>
                <li><strong>Next Visit Card:</strong> This card is crucial. It displays the next upcoming visit. It contains three key actions:</li>
                <ul>
                    <li><strong>Start Visit:</strong> This does NOT simply expand the card. It sets the activeVisit state, which triggers the ActiveVisitModal.</li>
                    <li><strong>Navigate & Call Buttons:</strong> Currently placeholders. In a native app, these would trigger intents to open a maps application or the phone dialer.</li>
                </ul>
             </ul>
             <h4>3.2 Schedule & Visit Execution (renderMDOSchedule)</h4>
             <p>This screen displays the MDO's planned visits in a timeline format.</p>
             <h5>Visit Card Logic:</h5>
             <ul>
                 <li><strong>Status Coloring:</strong> The left border color of a visit card is determined by its status (e.g., green for 'Completed', blue for 'Planned').</li>
                 <li><strong>Completed Visit Details:</strong> When a completed visit card (e.g., Metro Distributors) is clicked, activeSection is set. This conditionally renders the detailed view within the card, showing a hardcoded summary, task list, and photo gallery.</li>
             </ul>
             <h5>Active Visit Modal (ActiveVisitModal):</h5>
             <p>This is the core of the visit execution flow, triggered by the "Start Visit" button.</p>
             <CodeBlock>
{`const ActiveVisitModal = ({ visit, onClose }) => {
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [tasks, setTasks] = useState(
    visit.tasks.map(task => ({ text: task, completed: false }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);
      const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
      const seconds = String(diff % 60).padStart(2, '0');
      setElapsedTime(minutes + ":" + seconds);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleTaskToggle = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const handleSignature = () => {
    const timestamp = new Date().toLocaleString();
    alert('E-Signature Captured at: ' + timestamp);
  };
};`}
             </CodeBlock>
             <ul>
                <li><strong>Timer:</strong> A useEffect hook with setInterval calculates and updates the elapsed time every second.</li>
                <li><strong>Task Checklist:</strong> Manages its own state (tasks) derived from the visit prop. Toggling a checkbox updates this local state.</li>
                <li><strong>E-Signature:</strong> The handleSignature function demonstrates capturing a timestamp. When clicked, it creates a new Date() and formats it into a string to be displayed in an alert. In a real app, this would involve saving the signature image and the timestamp to the Visit entity.</li>
             </ul>
        </DocSection>
        
        <DocSection title="4. TSM (Territory Sales Manager) View" icon={Workflow}>
            <h4>4.1 Team Dashboard (renderTSMTeam)</h4>
            <p>Provides a high-level overview of the TSM's team performance. Currently uses static data.</p>
            <h4>4.2 Order Management (renderTSMOrders)</h4>
            <p>This screen demonstrates critical business logic from the proposal document.</p>
            <h5>Order Blocking Logic:</h5>
            <p>When the "New Order" button is clicked, a form appears. The core logic resides in the client selection and the subsequent UI state.</p>
            <CodeBlock>
{`// In the Client select dropdown:
<option disabled>Blocked Wholesaler (BLOCKED - Credit Hold)</option>

// Conditional rendering of the warning:
<div className="bg-red-50 ...">
  <AlertTriangle ... />
  <span>Order Blocked</span>
  <p>Client has exceeded credit limit...</p>
</div>

// Disabling the creation button:
<button className="..." opacity-50 cursor-not-allowed">
  Create Order (Blocked)
</button>`}
            </CodeBlock>
            <ul>
                <li><strong>Client Status:</strong> In a real app, the select options would be populated from the Client entity. Clients with `status === 'blocked'` or `outstanding_balance` greater than `credit_limit` would have the `disabled` attribute.</li>
                <li><strong>UI Feedback:</strong> When a blocked client is selected (or if the default selected client is blocked), a prominent warning div is shown, and the "Create Order" button is visually disabled with `opacity-50` and `cursor-not-allowed`.</li>
            </ul>
             <h4>4.3 Monthly Planning (renderTSMPlanning)</h4>
             <p>This screen reflects the planning and approval workflow.</p>
             <h5>Approval Status Logic:</h5>
             <p>The UI for each plan card changes based on its `status` property.</p>
             <CodeBlock>
{`// Example for a 'Pending Approval' card
<Badge className="bg-yellow-100 text-yellow-800">
  <Clock className="w-3 h-3 mr-1" /> Pending Approval
</Badge>

// Example for a 'Draft' card
<Badge className="bg-slate-100 text-slate-800">
  <Edit className="w-3 h-3 mr-1" /> Draft
</Badge>
// Action buttons are also conditionally rendered
<button>Submit for Approval</button> // Only for drafts`}
             </CodeBlock>
             <p>Different `Badge` components with distinct colors and icons are rendered based on the plan's status ('draft', 'pending_approval', 'approved'). Action buttons are also conditional; for example, "Submit for Approval" only appears for drafts.</p>
        </DocSection>

        <DocSection title="5. SKU Liquidation Module (Module 3)" icon={Package}>
            <h4>5.1 Implementation Strategy</h4>
            <p>The SKU Liquidation module tracks stock movement from distributors to retailers to farmers.</p>
            <CodeBlock>
{`// Stock flow tracking logic
const trackLiquidation = (distributorId, retailerId, farmerId, skuId, quantity) => {
  // Step 1: Distributor allocates stock to retailer
  updateDistributorStock(distributorId, skuId, -quantity);
  updateRetailerStock(retailerId, skuId, +quantity);
  
  // Step 2: Retailer sells to farmer (actual liquidation)
  updateRetailerStock(retailerId, skuId, -quantity);
  recordActualLiquidation(farmerId, skuId, quantity);
};`}
            </CodeBlock>
            <h4>5.2 Mobile UI Components</h4>
            <ul>
                <li><strong>Distributor View:</strong> Shows opening inventory, allocated stock, and remaining balance</li>
                <li><strong>Retailer Management:</strong> Track retailer-wise stock distribution with digital signatures</li>
                <li><strong>Liquidation Tracking:</strong> Monitor actual sales to farmers with proof capture</li>
                <li><strong>Real-time Sync:</strong> Offline capability with automatic sync when online</li>
            </ul>
        </DocSection>

        <DocSection title="6. Performance & Incentive Module (Module 6)" icon={TrendingUp}>
            <h4>6.1 Gamification Elements</h4>
            <p>The mobile app includes gamification features to motivate field staff.</p>
            <CodeBlock>
{`// Points calculation logic
const calculatePoints = (activity) => {
  const pointsMap = {
    'visit_completed': 50,
    'order_created': 100,
    'target_achieved': 200,
    'photo_uploaded': 25,
    'signature_captured': 30
  };
  return pointsMap[activity] || 0;
};

// Badge earning logic
const checkBadgeEligibility = (userStats) => {
  const badges = [];
  if (userStats.visits >= 100) badges.push('Century Maker');
  if (userStats.streak >= 7) badges.push('Week Warrior');
  return badges;
};`}
            </CodeBlock>
            <h4>6.2 Performance Tracking</h4>
            <ul>
                <li><strong>Target vs Achievement:</strong> Visual progress bars and percentage completion</li>
                <li><strong>Leaderboards:</strong> Team rankings with real-time updates</li>
                <li><strong>Incentive Calculation:</strong> Auto-calculated based on performance metrics</li>
                <li><strong>Export for Payroll:</strong> Generate reports for HR/payroll processing</li>
            </ul>
        </DocSection>

        <DocSection title="7. Distributor Self-Service Module (Module 5)" icon={Users}>
            <h4>7.1 Portal Features</h4>
            <p>2500+ distributors can access their own portal for order and payment tracking.</p>
            <CodeBlock>
{`// Distributor dashboard data structure
const distributorData = {
  orderHistory: [], // Live from NetSuite
  invoiceStatus: [], // Real-time invoice tracking
  creditLimits: {}, // Current credit position
  outstandingBalance: 0, // ODOS summary
  skuWiseHistory: [], // Product-wise order history
  alerts: [] // Automated notifications
};`}
            </CodeBlock>
            <h4>7.2 Integration Points</h4>
            <ul>
                <li><strong>NetSuite Integration:</strong> Live order and invoice data</li>
                <li><strong>Automated Alerts:</strong> Invoice generation, payment reminders</li>
                <li><strong>Feedback System:</strong> Dropdown-based feedback routing to internal teams</li>
                <li><strong>Credit Management:</strong> Real-time credit limit and outstanding display</li>
            </ul>
        </DocSection>

        <DocSection title="8. Key Business Rules Implementation" icon={Lightbulb}>
            <h4>8.1 Order Blocking System (Module 4)</h4>
            <ul>
                <li><strong>TSM Order Creation:</strong> TSMs can initiate new orders from the 'Team Orders' screen with real-time credit checking</li>
                <li><strong>Visual Warnings:</strong> Red alert boxes appear when clients exceed credit limits or are marked inactive</li>
                <li><strong>Disabled Actions:</strong> Order submission buttons are visually disabled and non-functional for blocked clients</li>
                <li><strong>Status Indicators:</strong> Clear badges show client status (Active, Blocked, Credit Hold, Inactive)</li>
            </ul>

            <h4>8.2 Planning & Approval Workflow (Module 2)</h4>
            <ul>
                <li><strong>Status Tracking:</strong> Plans display color-coded badges (Draft = Grey, Pending = Yellow, Approved = Green)</li>
                <li><strong>Conditional Actions:</strong> Submit for approval, edit drafts, view approval status based on current state</li>
                <li><strong>Hierarchical Approval:</strong> TSM creates → RMM approves → Goes to MDO workflow</li>
                <li><strong>Exception Handling:</strong> If roles are missing, planning shifts one level higher automatically</li>
            </ul>

            <h4>8.3 Hierarchical Permissions & Compliance</h4>
            <ul>
                <li><strong>Role-Based Views:</strong> MDOs focus on visit execution, TSMs on team oversight and planning</li>
                <li><strong>Order Creation Rights:</strong> Only TSMs and above can create orders; MDOs execute visits and plans</li>
                <li><strong>UI-Enforced Compliance:</strong> Business rules enforced through visual cues, not just backend validation</li>
                <li><strong>Geofencing Alerts:</strong> Automatic alerts to managers for route deviations or time violations</li>
            </ul>

            <h4>8.4 Data Integrity & Offline Capability</h4>
            <ul>
                <li><strong>Offline Data Entry:</strong> Full functionality in areas with limited connectivity</li>
                <li><strong>Auto-Sync:</strong> Data syncs automatically when connectivity is restored</li>
                <li><strong>Data Locking:</strong> Transactions lock after confirmation to prevent modifications</li>
                <li><strong>Alert System:</strong> Flags data that fails to sync for more than 3 days</li>
            </ul>
        </DocSection>

        <DocSection title="9. Technical Implementation Notes" icon={Code}>
            <h4>9.1 State Management Patterns</h4>
            <CodeBlock>
{`// Role-based rendering pattern
const renderContent = () => {
  switch(selectedRole) {
    case 'mdo':
      return renderMDOView();
    case 'tsm':
      return renderTSMView();
    default:
      return renderDefaultView();
  }
};

// Conditional action rendering
const renderActionButtons = (item) => {
  const actions = [];
  
  if (item.status === 'draft' && userRole === 'TSM') {
    actions.push(<button onClick={submitForApproval}>Submit</button>);
  }
  
  if (item.status === 'pending' && userRole === 'RMM') {
    actions.push(<button onClick={approve}>Approve</button>);
    actions.push(<button onClick={reject}>Reject</button>);
  }
  
  return actions;
};`}
            </CodeBlock>

            <h4>9.2 Data Flow Architecture</h4>
            <ul>
                <li><strong>Entity Integration:</strong> All static data should be replaced with Base44 entity calls</li>
                <li><strong>Real-time Updates:</strong> Use WebSocket connections for live data updates</li>
                <li><strong>Caching Strategy:</strong> Implement proper caching for offline capability</li>
                <li><strong>Error Handling:</strong> Graceful degradation when services are unavailable</li>
            </ul>

            <h4>9.3 Security Implementation</h4>
            <ul>
                <li><strong>JWT Authentication:</strong> Secure token-based authentication</li>
                <li><strong>Role-Based Access:</strong> UI elements rendered based on user permissions</li>
                <li><strong>Data Encryption:</strong> All sensitive data encrypted in transit and at rest</li>
                <li><strong>Audit Logging:</strong> Complete audit trail for all user actions</li>
            </ul>
        </DocSection>
      </div>
    </div>
  );
}
