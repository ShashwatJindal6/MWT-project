/**
 * L3 Schools - Course Catalog Data
 * Enriched structured course metadata mapped to the existing 22 courses
 * Supporting browser (window global) and Node.js module environments.
 */

const COURSE_CATALOG = [
  // --- Development ---
  {
    id: "dev-py-beginners",
    title: "Python for Beginners",
    category: "development",
    categoryName: "Development",
    difficulty: "beginner",
    description: "Write your first Python programs, control flow, functions, and fundamental data structures with interactive coding tasks.",
    prerequisites: ["None - beginner friendly"],
    requiredSkills: "Basic computer literacy and problem-solving enthusiasm",
    minSkillReadiness: 1, // 0 - 10 scale
    academicRigor: 30,    // 0 - 100 scale
    estimatedHours: 24,
    keyTopics: ["Variables & Types", "Conditionals & Loops", "Functions", "Lists & Dictionaries", "File I/O"]
  },
  {
    id: "dev-c-fundamentals",
    title: "C Fundamentals",
    category: "development",
    categoryName: "Development",
    difficulty: "beginner",
    description: "Deep dive into procedural programming, memory addresses, pointers, and system-level computing fundamentals.",
    prerequisites: ["Basic logic or any introductory programming"],
    requiredSkills: "Basic logic structures and patience with low-level debugging",
    minSkillReadiness: 3,
    academicRigor: 50,
    estimatedHours: 32,
    keyTopics: ["Data Types & Memory", "Pointers & References", "Structs", "Dynamic Memory Allocation", "Standard Library"]
  },
  {
    id: "dev-cpp-oop",
    title: "C++ OOP & Clean Code",
    category: "development",
    categoryName: "Development",
    difficulty: "intermediate",
    description: "Object-oriented design patterns, inheritance, polymorphism, templates, and modern clean C++ idioms.",
    prerequisites: ["C Fundamentals or introductory programming experience"],
    requiredSkills: "Solid familiarity with procedural programming and compilation",
    minSkillReadiness: 5,
    academicRigor: 65,
    estimatedHours: 36,
    keyTopics: ["Classes & Objects", "Inheritance & Virtual Functions", "RAII & Smart Pointers", "Templates", "Clean Code Architecture"]
  },
  {
    id: "dev-algo-dsa",
    title: "Algorithms (DSA) with C++",
    category: "development",
    categoryName: "Development",
    difficulty: "advanced",
    description: "Rigorous study of trees, graphs, dynamic programming, asymptotic complexity analysis, and competitive coding problem solving.",
    prerequisites: ["C++ OOP & Clean Code", "Discrete Mathematics or basic proof logic"],
    requiredSkills: "Confident C++ syntax, pointers, recursion, and mathematical reasoning",
    minSkillReadiness: 7,
    academicRigor: 80,
    estimatedHours: 48,
    keyTopics: ["Trees & Balanced BSTs", "Graph Traversals (BFS/DFS)", "Dijkstra & Shortest Paths", "Dynamic Programming", "Time & Space Complexity"]
  },
  {
    id: "dev-system-design",
    title: "System Design Basics",
    category: "development",
    categoryName: "Development",
    difficulty: "advanced",
    description: "Architecting scalable, distributed systems: load balancers, caching layers, sharding, CAP theorem, and fault tolerance.",
    prerequisites: ["Data structures, basic networking, and client-server concepts"],
    requiredSkills: "Understanding of backend services, latency, and throughput",
    minSkillReadiness: 8,
    academicRigor: 82,
    estimatedHours: 40,
    keyTopics: ["Client-Server Architecture", "Caching Strategies (Redis)", "Database Partitioning", "Load Balancing", "Microservices vs Monoliths"]
  },

  // --- Web Development ---
  {
    id: "web-html-css",
    title: "HTML & CSS Mastery",
    category: "webdev",
    categoryName: "Web Development",
    difficulty: "beginner",
    description: "Semantic HTML5, responsive CSS Grid and Flexbox layouts, CSS variables, and accessible user interface patterns.",
    prerequisites: ["None - zero prior coding required"],
    requiredSkills: "Curiosity for visual design and basic browser usage",
    minSkillReadiness: 1,
    academicRigor: 25,
    estimatedHours: 20,
    keyTopics: ["Semantic HTML5", "Modern CSS Flexbox & Grid", "Media Queries & Responsive Units", "Typography & Spacing", "Web Accessibility (a11y)"]
  },
  {
    id: "web-js-interfaces",
    title: "JavaScript for Interfaces",
    category: "webdev",
    categoryName: "Web Development",
    difficulty: "beginner",
    description: "DOM manipulation, asynchronous fetch APIs, event loops, transitions, and writing interactive dynamic frontends.",
    prerequisites: ["HTML & CSS Mastery"],
    requiredSkills: "Knowledge of HTML structure and CSS styling rules",
    minSkillReadiness: 3,
    academicRigor: 45,
    estimatedHours: 30,
    keyTopics: ["DOM Query & Manipulation", "Events & Event Delegation", "ES6+ Syntax", "Promises & async/await", "State & Client Storage"]
  },
  {
    id: "web-react-fundamentals",
    title: "React Fundamentals",
    category: "webdev",
    categoryName: "Web Development",
    difficulty: "intermediate",
    description: "Component architecture, hooks (useState, useEffect, useMemo), unidirectional data flow, and modern React best practices.",
    prerequisites: ["JavaScript for Interfaces"],
    requiredSkills: "Solid JavaScript fundamentals, array methods, and destructuring",
    minSkillReadiness: 5,
    academicRigor: 60,
    estimatedHours: 36,
    keyTopics: ["JSX & Components", "Props & State", "Hooks Lifecycle", "Context API", "Component Composition"]
  },
  {
    id: "web-api-rest",
    title: "API Integration (REST)",
    category: "webdev",
    categoryName: "Web Development",
    difficulty: "intermediate",
    description: "Consume and design RESTful endpoints, handle authentication headers, CORS, HTTP status codes, and resilient error recovery.",
    prerequisites: ["JavaScript for Interfaces"],
    requiredSkills: "Asynchronous JavaScript and JSON data manipulation",
    minSkillReadiness: 4,
    academicRigor: 55,
    estimatedHours: 22,
    keyTopics: ["HTTP Verbs & Status Codes", "REST API Conventions", "Authentication Tokens & Headers", "Payload Validation", "Pagination & Error Handling"]
  },

  // --- Artificial Intelligence ---
  {
    id: "ai-ml-essentials",
    title: "Machine Learning Essentials",
    category: "ai",
    categoryName: "Artificial Intelligence",
    difficulty: "intermediate",
    description: "Supervised and unsupervised learning, linear regression, classification trees, cross-validation, and Scikit-Learn pipelines.",
    prerequisites: ["Python for Beginners", "High-school algebra and statistics"],
    requiredSkills: "Python basics and comfort with matrix / coordinate intuition",
    minSkillReadiness: 5,
    academicRigor: 70,
    estimatedHours: 38,
    keyTopics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "K-Means Clustering", "Model Evaluation & Metrics", "Feature Scaling"]
  },
  {
    id: "ai-deep-learning",
    title: "Deep Learning Fundamentals",
    category: "ai",
    categoryName: "Artificial Intelligence",
    difficulty: "advanced",
    description: "Neural network forward/backward propagation, activation functions, loss optimization with PyTorch, and gradient descent mechanics.",
    prerequisites: ["Machine Learning Essentials", "Calculus and linear algebra basics"],
    requiredSkills: "Multivariable calculus intuition, matrix operations, and Python",
    minSkillReadiness: 7,
    academicRigor: 85,
    estimatedHours: 44,
    keyTopics: ["Artificial Neural Networks", "Backpropagation & Optimizers (Adam, SGD)", "Loss Functions", "PyTorch Tensors & Modules", "Overfitting & Regularization"]
  },
  {
    id: "ai-nlp-text",
    title: "NLP & Text Models",
    category: "ai",
    categoryName: "Artificial Intelligence",
    difficulty: "advanced",
    description: "Tokenization, embeddings (Word2Vec), sequence modeling, transformer attention mechanisms, and fine-tuning language models.",
    prerequisites: ["Deep Learning Fundamentals", "Python proficiency"],
    requiredSkills: "Deep learning models, tensor manipulation, and statistical linguistics",
    minSkillReadiness: 8,
    academicRigor: 88,
    estimatedHours: 42,
    keyTopics: ["Text Preprocessing & Tokenization", "Vector Embeddings", "Self-Attention Mechanism", "Transformers & LLM Concepts", "Sentiment & Classification Tasks"]
  },
  {
    id: "ai-vision-basics",
    title: "Computer Vision Basics",
    category: "ai",
    categoryName: "Artificial Intelligence",
    difficulty: "intermediate",
    description: "Image processing, convolution filters, edge detection, OpenCV essentials, and Convolutional Neural Networks (CNNs).",
    prerequisites: ["Machine Learning Essentials or Python programming"],
    requiredSkills: "Array slicing, 2D matrix representations, and basic Python",
    minSkillReadiness: 6,
    academicRigor: 72,
    estimatedHours: 34,
    keyTopics: ["Color Spaces & Transformations", "Convolution Kernels & Filtering", "Edge & Contour Detection", "CNN Architecture", "Image Classification Pipeline"]
  },

  // --- DevOps ---
  {
    id: "devops-cicd",
    title: "CI/CD with Pipelines",
    category: "devops",
    categoryName: "DevOps",
    difficulty: "intermediate",
    description: "Automate build verification, linting, unit tests, and continuous delivery deployment pipelines using GitHub Actions.",
    prerequisites: ["Basic Git and command line familiarity"],
    requiredSkills: "Git commands, YAML configuration, and shell basics",
    minSkillReadiness: 4,
    academicRigor: 52,
    estimatedHours: 26,
    keyTopics: ["Git Branching Strategies", "Pipeline YAML Configuration", "Automated Testing Triggers", "Artifact Generation", "Continuous Deployment Releases"]
  },
  {
    id: "devops-docker",
    title: "Docker Essentials",
    category: "devops",
    categoryName: "DevOps",
    difficulty: "beginner",
    description: "Containerization concepts, writing Dockerfiles, managing multi-container setups with Docker Compose, and image optimization.",
    prerequisites: ["Basic command line usage"],
    requiredSkills: "Linux terminal navigation and package concept awareness",
    minSkillReadiness: 3,
    academicRigor: 45,
    estimatedHours: 22,
    keyTopics: ["Containers vs Virtual Machines", "Dockerfile Instructions", "Image Layers & Caching", "Docker Compose Orchestration", "Volumes & Networking"]
  },
  {
    id: "devops-k8s",
    title: "Kubernetes Starter",
    category: "devops",
    categoryName: "DevOps",
    difficulty: "advanced",
    description: "Orchestrate container clusters with pods, deployments, services, ingress controllers, config maps, and rolling update strategies.",
    prerequisites: ["Docker Essentials", "Basic networking concepts"],
    requiredSkills: "Comfort with container registries, networking ports, and YAML manifests",
    minSkillReadiness: 7,
    academicRigor: 78,
    estimatedHours: 40,
    keyTopics: ["Cluster Architecture", "Pods, ReplicaSets & Deployments", "ClusterIP, NodePort & Ingress", "ConfigMaps & Secrets", "Self-Healing & Auto-scaling"]
  },
  {
    id: "devops-monitoring",
    title: "Monitoring & Observability",
    category: "devops",
    categoryName: "DevOps",
    difficulty: "intermediate",
    description: "Metric collection with Prometheus, Grafana visualization dashboards, structured logging, distributed tracing, and alert triggers.",
    prerequisites: ["Docker Essentials or basic server management"],
    requiredSkills: "Understanding of latency metrics, logs, and server health checks",
    minSkillReadiness: 5,
    academicRigor: 60,
    estimatedHours: 28,
    keyTopics: ["The Three Pillars of Observability", "Prometheus Metrics & Exporters", "Grafana Dashboard Design", "Log Aggregation & Searching", "SLAs, SLOs & Alert Rules"]
  },

  // --- AWS Services ---
  {
    id: "aws-iam",
    title: "AWS IAM & Access Control",
    category: "aws",
    categoryName: "AWS Services",
    difficulty: "beginner",
    description: "Identity and Access Management, users, groups, role delegation, least-privilege JSON security policies, and MFA enforcement.",
    prerequisites: ["Basic understanding of accounts and cloud computing"],
    requiredSkills: "Attention to detail with security policies and JSON formatting",
    minSkillReadiness: 2,
    academicRigor: 42,
    estimatedHours: 18,
    keyTopics: ["Users, Groups & Roles", "Policy JSON Structure & Evaluation", "Cross-Account Access", "Principle of Least Privilege", "Security Auditing"]
  },
  {
    id: "aws-ec2",
    title: "EC2 & Networking Essentials",
    category: "aws",
    categoryName: "AWS Services",
    difficulty: "intermediate",
    description: "Launch virtual machines, configure VPC subnets, security groups, route tables, Elastic IPs, and elastic load balancers.",
    prerequisites: ["AWS IAM & Access Control or basic networking knowledge"],
    requiredSkills: "IP addressing, subnets, SSH keypairs, and Linux basics",
    minSkillReadiness: 5,
    academicRigor: 62,
    estimatedHours: 30,
    keyTopics: ["VPC Architecture & Subnets", "Security Groups & NACLs", "EC2 Instance Types & AMIs", "Auto Scaling Groups", "Internet Gateways & Route Tables"]
  },
  {
    id: "aws-s3",
    title: "S3 Storage & Lifecycle",
    category: "aws",
    categoryName: "AWS Services",
    difficulty: "beginner",
    description: "Object storage architecture, bucket policies, encryption at rest, automated lifecycle transitions, versioning, and static web hosting.",
    prerequisites: ["Basic cloud computing awareness"],
    requiredSkills: "Basic file system understanding and JSON policy awareness",
    minSkillReadiness: 2,
    academicRigor: 38,
    estimatedHours: 16,
    keyTopics: ["Buckets & Object Keys", "Storage Classes (Standard, Glacier)", "Lifecycle Rules", "Static Website Hosting", "Bucket Policies & Presigned URLs"]
  },
  {
    id: "aws-lambda",
    title: "Serverless with Lambda",
    category: "aws",
    categoryName: "AWS Services",
    difficulty: "intermediate",
    description: "Event-driven compute without server management, API Gateway integrations, environment variables, execution roles, and concurrency control.",
    prerequisites: ["Python for Beginners or JavaScript for Interfaces", "AWS IAM"],
    requiredSkills: "Writing handler functions, JSON events, and asynchronous execution",
    minSkillReadiness: 5,
    academicRigor: 64,
    estimatedHours: 26,
    keyTopics: ["Event-Driven Execution Model", "Trigger Sources (S3, API Gateway)", "Lambda Execution Roles", "Cold Starts & Concurrency", "Serverless Frameworks"]
  },
  {
    id: "aws-cloudwatch",
    title: "CloudWatch & Alerts",
    category: "aws",
    categoryName: "AWS Services",
    difficulty: "intermediate",
    description: "CloudWatch metrics, log groups, metric filters, alarm triggers, SNS notifications, and proactive operational cloud dashboards.",
    prerequisites: ["AWS IAM", "Any basic AWS compute service (EC2 or Lambda)"],
    requiredSkills: "Understanding of threshold alarms and server operational metrics",
    minSkillReadiness: 4,
    academicRigor: 54,
    estimatedHours: 20,
    keyTopics: ["Standard & Custom Metrics", "Log Groups & Metric Filters", "Alarm Thresholds & Actions", "SNS Notification Integration", "CloudWatch Dashboards"]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { COURSE_CATALOG };
}
if (typeof window !== "undefined") {
  window.COURSE_CATALOG = COURSE_CATALOG;
}
