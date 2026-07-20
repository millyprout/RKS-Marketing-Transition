window.RKS_APP_DATA = {
  application: {
    title: 'RKS Marketing Transition & Onboarding',
    description: 'A centralized knowledge hub for RKS Design and PA-AI marketing systems, processes, resources, and working sessions.'
  },

  metrics: [
    { label: 'Working sessions', value: '14', meta: 'Structured training modules' },
    { label: 'Brand ecosystems', value: '2', meta: 'RKS Design and PA-AI' },
    { label: 'Reference tools', value: '2', meta: 'Approval map and platform directory' },
    { label: 'Current assignment', value: '01', meta: 'Working Session 1 deliverables' }
  ],

  sessions: [
    {
      number: 1,
      title: 'Marketing Overview & Ecosystem',
      description: 'Understand how RKS Design and PA-AI differ, how marketing supports each organization, and how responsibilities, approvals, platforms, and priorities connect.',
      featured: true,
      search: 'marketing overview ecosystem rks pa-ai priorities responsibilities approvals session 1',
      modules: [
        { brand: 'rks', label: 'RKS Design module', title: 'RKS Design', subtitle: 'Marketing Overview & Ecosystem', url: 'modules/session-01-rks.html', logo: 'assets/logos/rks-mark-white.png' },
        { brand: 'paai', label: 'PA-AI module', title: 'PA-AI', subtitle: 'Marketing Overview & Ecosystem', url: 'modules/session-01-paai.html', logo: 'assets/paai/logo-white.png' }
      ]
    },
    { number: 2, title: 'Marketing Resources & Systems', description: 'Learn where shared files, templates, brand assets, historical projects, platforms, and daily marketing resources are stored.', search: 'marketing resources systems shared files templates brand assets software platforms' },
    { number: 3, title: 'Brand Voice & Standards', description: 'Understand the writing styles, messaging principles, visual standards, and brand differences that guide RKS Design and PA-AI.', search: 'brand voice standards writing messaging visual principles rks pa-ai' },
    { number: 4, title: 'Content Marketing & SEO', description: 'Plan, create, optimize, publish, and measure blogs, website content, newsletters, and search-driven marketing initiatives.', search: 'content marketing seo blogs keywords newsletters search console' },
    { number: 5, title: 'Graphic Design & Brand Assets', description: 'Create and manage reusable marketing assets, visual essays, templates, graphics, and approved brand materials.', search: 'graphic design brand assets visual essays templates canva adobe' },
    { number: 6, title: 'Social Media Management', description: 'Plan, create, schedule, publish, recycle, and measure social content across RKS Design and PA-AI channels.', search: 'social media management linkedin instagram youtube socialbee scheduling' },
    { number: 7, title: 'Website Front-End & Back-End Management', description: 'Manage the RKS WordPress and PA-AI Wix websites, including page editing, publishing, templates, SEO fields, and quality control.', search: 'website front-end back-end management wordpress elementor wix publishing' },
    { number: 8, title: 'Video Production & Studio Equipment', description: 'Prepare and operate the studio, cameras, audio, lighting, interviews, file handling, and production equipment.', search: 'video production studio equipment cameras audio lighting interviews' },
    { number: 9, title: 'Video Editing & Distribution Workflow', description: 'Edit, review, export, organize, publish, and distribute video content across the appropriate platforms.', search: 'video editing distribution davinci premiere reduct youtube linkedin' },
    { number: 10, title: 'Website, PR & Marketing Workflows', description: 'Coordinate website updates, press releases, media outreach, approvals, publishing, and cross-channel promotion.', search: 'website pr marketing workflows press releases media outreach approvals publishing' },
    { number: 11, title: 'Marketing Operations & Project Management', description: 'Manage calendars, priorities, requests, project status, approvals, handoffs, and documentation.', search: 'marketing operations project management calendars priorities requests handoffs' },
    { number: 12, title: 'AI Tools & Marketing Efficiency', description: 'Use AI tools responsibly to accelerate research, writing, design, organization, repurposing, and routine marketing work.', search: 'ai tools marketing efficiency chatgpt claude research writing design' },
    { number: 13, title: 'Weekly Marketing Workflow', description: 'Understand the expected weekly cadence for planning, content creation, meetings, publishing, reporting, and follow-up.', search: 'weekly marketing workflow cadence planning meetings publishing reporting' },
    { number: 14, title: 'Knowledge Transfer & Q&A', description: 'Resolve remaining questions, confirm ownership and access, review open projects, and validate readiness to manage the marketing ecosystem independently.', search: 'knowledge transfer q&a questions ownership access open projects readiness' }
  ],

  brands: [
    {
      id: 'rks-design',
      brand: 'rks',
      name: 'RKS Design',
      label: 'RKS brand reference',
      description: 'Human-centered industrial design, innovation strategy, engineering, and product development.',
      topics: ['Positioning', 'Services', 'Audience', 'Marketing'],
      url: 'modules/rks-brand.html',
      button: 'Open RKS module',
      logo: 'assets/logos/rks-mark-white.png'
    },
    {
      id: 'pa-ai',
      brand: 'paai',
      name: 'PA-AI',
      label: 'PA-AI brand reference',
      description: 'The Human Intelligence Layer that helps organizations align AI decisions with human trust, adoption, and value.',
      topics: ['Category', 'Methodology', 'Audience', 'Thought leadership'],
      url: 'modules/paai-brand.html',
      button: 'Open PA-AI module',
      logo: 'assets/paai/logo-gradient-mark.png'
    }
  ],

  deliverables: {
    sessionNumber: 1,
    sessionTitle: 'Marketing Overview & Ecosystem',
    dueText: 'Due before Working Session 2',
    items: [
      'Prepare 5–10 questions about anything that is unclear',
      'Document 3 observations or takeaways from your exploration',
      'List any resources or processes you had difficulty locating or understanding'
    ],
    futureMessage: 'Future session deliverables will be added here as each working session is built.'
  },

  resources: [
    { id: 'brand-modules', icon: 'Aa', title: 'Brand Modules', description: 'RKS and PA-AI messaging and visual references', url: 'modules/rks-brand.html' },
    { id: 'approval-map', icon: '✓', title: 'Approval Map', description: 'Who reviews and approves what', url: 'resources/approval-map.html' },
    { id: 'platform-directory', icon: '⌘', title: 'Platform Directory', description: 'Websites, tools, and ownership', url: 'resources/platform-directory.html' },
    { id: 'marketing-backlog', icon: '▤', title: 'Marketing Backlog', description: 'Active, recurring, and future work', url: '#' }
  ]
};
