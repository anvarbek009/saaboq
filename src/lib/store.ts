import { Video, Course, UserProfile, Comment, WatchProgress, ContentReport, DifficultyLevel, VideoVisibility } from '@/types';

// Storage Keys
const STORAGE_KEYS = {
  USERS: 'saaboq_users',
  CURRENT_USER: 'saaboq_current_user',
  VIDEOS: 'saaboq_videos',
  COURSES: 'saaboq_courses',
  SUBSCRIPTIONS: 'saaboq_subscriptions',
  LIKES: 'saaboq_likes',
  SAVED: 'saaboq_saved_videos',
  HISTORY: 'saaboq_history',
  COMMENTS: 'saaboq_comments',
  REPORTS: 'saaboq_reports',
};

// Seed Users
const SEED_USERS: UserProfile[] = [
  {
    id: 'user-elena',
    username: 'elena_rostova',
    display_name: 'Dr. Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    bio: 'Distributed Systems Architect & Ex-Research Fellow. Focused on consensus protocols (Raft, Paxos), formal state machine verification, and actor runtimes.',
    expertise: ['Distributed Systems', 'Raft Consensus', 'Formal Verification', 'Database Internals'],
    is_creator: true,
    role: 'creator',
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 'user-marcus',
    username: 'marcus_vance',
    display_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    bio: 'Deep learning research engineer. Specializing in Transformer attention mechanisms, CUDA kernel fusion, and large-scale pre-training dynamics.',
    expertise: ['Deep Learning', 'Transformers', 'CUDA & PyTorch', 'LLM Architecture'],
    is_creator: true,
    role: 'creator',
    created_at: '2024-02-10T11:00:00Z',
  },
  {
    id: 'user-sophia',
    username: 'dr_sophia_chen',
    display_name: 'Dr. Sophia Chen',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    bio: 'Quantum computing researcher. Investigating superconducting qubit circuits, quantum state tomography, and error mitigation algorithms.',
    expertise: ['Quantum Computing', 'Qubit Circuits', 'Linear Algebra', 'Quantum Algorithms'],
    is_creator: true,
    role: 'creator',
    created_at: '2024-02-22T09:30:00Z',
  },
  {
    id: 'user-alex',
    username: 'alex_thorne',
    display_name: 'Alex Thorne',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    bio: 'Linux kernel contributor and cryptography researcher. Working on eBPF telemetry pipelines and zero-knowledge proof verification systems.',
    expertise: ['Linux Kernel', 'eBPF', 'Zero-Knowledge Proofs', 'Systems Security'],
    is_creator: true,
    role: 'creator',
    created_at: '2024-03-01T14:15:00Z',
  },
  {
    id: 'user-admin',
    username: 'admin',
    display_name: 'Saaboq Platform Admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: 'Platform integrity and content moderation administrator.',
    expertise: ['Platform Governance', 'Moderation'],
    is_creator: false,
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-viewer',
    username: 'julian_dev',
    display_name: 'Julian Sterling',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Software engineer studying distributed storage engines and transformer inference.',
    expertise: ['Systems Programming', 'Go', 'Python'],
    is_creator: false,
    role: 'viewer',
    created_at: '2024-03-10T12:00:00Z',
  }
];

// Seed Courses
const SEED_COURSES: Course[] = [
  {
    id: 'course-dist-sys',
    creator_id: 'user-elena',
    title: 'Distributed Systems & Consensus Architecture',
    slug: 'distributed-systems-consensus-architecture',
    description: 'A rigorous graduate-level curriculum on building fault-tolerant distributed services: network partitions, Raft leader election, commit quorum, and state-machine replication.',
    thumbnail_url: '/thumbnails/distributed_systems.jpg',
    category: 'Computer Science',
    difficulty: 'Advanced',
    total_lessons: 4,
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'course-transformers',
    creator_id: 'user-marcus',
    title: 'Transformer Architectures from First Principles',
    slug: 'transformer-architectures-from-first-principles',
    description: 'Comprehensive mathematical breakdown of self-attention, query-key-value projections, positional embeddings, and memory-efficient matrix computation.',
    thumbnail_url: '/thumbnails/transformer_ai.jpg',
    category: 'AI & Machine Learning',
    difficulty: 'Advanced',
    total_lessons: 3,
    created_at: '2024-02-15T15:00:00Z',
  },
  {
    id: 'course-systems-internals',
    creator_id: 'user-alex',
    title: 'Modern OS Kernel & Observability Architecture',
    slug: 'modern-os-kernel-observability-architecture',
    description: 'Operating system virtual memory paging, page table translation, kernel space hooks, and writing safe in-kernel eBPF instrumentation filters.',
    thumbnail_url: '/thumbnails/kernel_ebpf.jpg',
    category: 'Systems & DevOps',
    difficulty: 'Intermediate',
    total_lessons: 2,
    created_at: '2024-03-05T09:00:00Z',
  }
];

// Seed Videos
const SEED_VIDEOS: Video[] = [
  {
    id: 'vid-raft-01',
    creator_id: 'user-elena',
    course_id: 'course-dist-sys',
    lesson_order: 1,
    title: 'Distributed Systems & Raft Consensus: The Fundamental Dilemma',
    description: 'An exhaustive exploration of distributed consensus dilemmas: why 2-phase commit fails under network partitions, the CAP theorem trade-offs, and how Raft structures leader election and term monotonicity.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: '/thumbnails/distributed_systems.jpg',
    duration_seconds: 1965, // 32:45
    views_count: 1420,
    likes_count: 312,
    category: 'Computer Science',
    language: 'English',
    difficulty: 'Advanced',
    visibility: 'public',
    chapters: [
      { timestamp: 0, title: 'Consensus Problem & Partition Failures' },
      { timestamp: 252, title: 'The Fallacy of Two-Phase Commit' },
      { timestamp: 690, title: 'Raft State Machine & Leader Election' },
      { timestamp: 1335, title: 'Log Replication Quorum & Commit Safety' },
      { timestamp: 1720, title: 'Split Votes & Randomized Election Timeouts' },
    ],
    resources: [
      { title: 'In Search of an Understandable Consensus Algorithm (Raft Whitepaper)', url: 'https://raft.github.io/raft.pdf', type: 'paper' },
      { title: 'Interactive Raft Consensus Scope Visualizer', url: 'https://raft.github.io', type: 'link' },
      { title: 'Production Go Raft State Machine Implementation', url: 'https://github.com/hashicorp/raft', type: 'code' },
    ],
    created_at: '2024-02-05T10:30:00Z',
  },
  {
    id: 'vid-storage-02',
    creator_id: 'user-elena',
    course_id: 'course-dist-sys',
    lesson_order: 2,
    title: 'Storage Engine Architectures: LSM-Trees vs B-Trees in Depth',
    description: 'Analyzing the trade-offs between append-only Log-Structured Merge-Trees and in-place B-Trees. We examine write amplification, WAL logs, memtable flushes, and multi-tier compaction.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: '/thumbnails/database_engines.jpg',
    duration_seconds: 1540, // 25:40
    views_count: 980,
    likes_count: 245,
    category: 'Computer Science',
    language: 'English',
    difficulty: 'Advanced',
    visibility: 'public',
    chapters: [
      { timestamp: 0, title: 'Read vs Write Amplification Factors' },
      { timestamp: 320, title: 'Memtable & WAL Durability Guarantees' },
      { timestamp: 850, title: 'SSTable Immutable Segments & Bloom Filters' },
      { timestamp: 1230, title: 'Leveled Compaction vs Size-Tiered Compaction' },
    ],
    resources: [
      { title: 'The Log-Structured Merge-Tree (O\'Neil et al.)', url: 'https://www.cs.umb.edu/~poneil/lsmtree.pdf', type: 'paper' },
      { title: 'RocksDB Architecture Guide', url: 'https://github.com/facebook/rocksdb/wiki', type: 'link' },
    ],
    created_at: '2024-02-12T14:00:00Z',
  },
  {
    id: 'vid-transformer-01',
    creator_id: 'user-marcus',
    course_id: 'course-transformers',
    lesson_order: 1,
    title: 'Transformer Self-Attention: Mathematical Derivations & Matrix Projections',
    description: 'Detailed walkthrough of the scaled dot-product attention equation: Softmax(QK^T / sqrt(d_k))V. Understanding why dot products grow large with dimensionality, multi-head projection subspaces, and memory complexity.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: '/thumbnails/transformer_ai.jpg',
    duration_seconds: 2460, // 41:00
    views_count: 2150,
    likes_count: 580,
    category: 'AI & Machine Learning',
    language: 'English',
    difficulty: 'Advanced',
    visibility: 'public',
    chapters: [
      { timestamp: 0, title: 'Sequence-to-Sequence Recurrence Bottlenecks' },
      { timestamp: 405, title: 'Query, Key, and Value Geometric Projections' },
      { timestamp: 1100, title: 'The sqrt(d_k) Normalization Factor Explained' },
      { timestamp: 1750, title: 'Multi-Head Attention Linear Concatenation' },
      { timestamp: 2160, title: 'Quadratic O(N^2) Memory & FlashAttention Tiling' },
    ],
    resources: [
      { title: 'Attention Is All You Need (Vaswani et al.)', url: 'https://arxiv.org/abs/1706.03762', type: 'paper' },
      { title: 'PyTorch Self-Attention Implementation', url: 'https://github.com/pytorch/pytorch', type: 'code' },
    ],
    created_at: '2024-02-18T16:20:00Z',
  },
  {
    id: 'vid-quantum-01',
    creator_id: 'user-sophia',
    title: 'Quantum Computing: Qubit Superposition, Bloch Sphere & Logic Gates',
    description: 'Foundations of quantum information science: defining qubit state vectors |ψ⟩ = α|0⟩ + β|1⟩, geometric visualization on the Bloch sphere, unitary matrix transformations, and quantum entanglement Bell states.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail_url: '/thumbnails/quantum_computing.jpg',
    duration_seconds: 2280, // 38:00
    views_count: 1720,
    likes_count: 410,
    category: 'Mathematics & Theory',
    language: 'English',
    difficulty: 'Advanced',
    visibility: 'public',
    chapters: [
      { timestamp: 0, title: 'Classical Bits vs Quantum Superposition' },
      { timestamp: 435, title: 'Bloch Sphere Polar & Azimuthal Coordinates' },
      { timestamp: 1000, title: 'Single Qubit Gates: Pauli-X, Y, Z, and Hadamard' },
      { timestamp: 1570, title: 'Two-Qubit CNOT & Entanglement Bell States' },
      { timestamp: 2040, title: 'Measurement Collapse & Decoherence Realities' },
    ],
    resources: [
      { title: 'Quantum Computation and Quantum Information (Nielsen & Chuang)', url: 'https://www.cambridge.org', type: 'paper' },
      { title: 'Qiskit Open-Source Quantum SDK', url: 'https://qiskit.org', type: 'code' },
    ],
    created_at: '2024-02-25T11:45:00Z',
  },
  {
    id: 'vid-ebpf-01',
    creator_id: 'user-alex',
    course_id: 'course-systems-internals',
    lesson_order: 1,
    title: 'Linux Kernel Internals: Virtual Memory Paging & eBPF Hooks',
    description: 'How the Linux kernel translates virtual addresses through multi-level page tables to physical memory, handling page faults, and running safe sandboxed eBPF bytecode programs at kprobes and tracepoints.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail_url: '/thumbnails/kernel_ebpf.jpg',
    duration_seconds: 1890, // 31:30
    views_count: 1290,
    likes_count: 340,
    category: 'Systems & DevOps',
    language: 'English',
    difficulty: 'Intermediate',
    visibility: 'public',
    chapters: [
      { timestamp: 0, title: 'Process Virtual Address Space Layout' },
      { timestamp: 390, title: 'Multi-Level Page Tables & TLB Caching' },
      { timestamp: 920, title: 'Page Fault Exceptions & Demand Paging' },
      { timestamp: 1380, title: 'eBPF Verifier Architecture & In-Kernel Maps' },
    ],
    resources: [
      { title: 'Linux Kernel Documentation: Virtual Memory', url: 'https://www.kernel.org/doc/html/latest/admin-guide/mm/', type: 'paper' },
      { title: 'eBPF Application Development with Cilium / libbpf', url: 'https://ebpf.io', type: 'code' },
    ],
    created_at: '2024-03-08T13:10:00Z',
  },
  {
    id: 'vid-zk-01',
    creator_id: 'user-alex',
    title: 'Zero-Knowledge Proofs: Arithmetic Circuits to Polynomial Commitments',
    description: 'A mathematical introduction to ZK-SNARKs: transforming computational statements into Rank-1 Constraint Systems (R1CS), quadratic arithmetic programs (QAP), and verifying cryptographic proofs in constant time.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail_url: '/thumbnails/zero_knowledge.jpg',
    duration_seconds: 2700, // 45:00
    views_count: 860,
    likes_count: 220,
    category: 'Mathematics & Theory',
    language: 'English',
    difficulty: 'Advanced',
    visibility: 'public',
    chapters: [
      { timestamp: 0, title: 'The Concept of Zero-Knowledge Verifiability' },
      { timestamp: 480, title: 'Arithmetic Circuits & R1CS Equations' },
      { timestamp: 1140, title: 'Polynomial Interpolation & QAP Reductions' },
      { timestamp: 1860, title: 'KZG Polynomial Commitments & Pairings' },
      { timestamp: 2400, title: 'Succinctness & Constant-Time Verification' },
    ],
    resources: [
      { title: 'Why and How zk-SNARK Works (Maksym Petkus)', url: 'https://arxiv.org/abs/1906.07221', type: 'paper' },
      { title: 'Circom: Language for Designing ZK Arithmetic Circuits', url: 'https://docs.circom.io', type: 'code' },
    ],
    created_at: '2024-03-12T17:00:00Z',
  }
];

// Seed Comments
const SEED_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    video_id: 'vid-raft-01',
    user_id: 'user-marcus',
    content: 'The clarity on randomized election timeouts resolving split-vote deadlocks is exceptional. Required viewing for all junior systems engineers.',
    created_at: '2024-02-06T09:12:00Z',
  },
  {
    id: 'comm-2',
    video_id: 'vid-raft-01',
    user_id: 'user-alex',
    content: 'Particularly appreciated the safety proof discussion around log matching property invariants at minute 22. Great lesson Elena.',
    created_at: '2024-02-07T14:45:00Z',
  },
  {
    id: 'comm-3',
    video_id: 'vid-transformer-01',
    user_id: 'user-sophia',
    content: 'Brilliant geometric breakdown of the Softmax scaling factor 1/sqrt(d_k). It avoids gradient vanishing in high-dimensional projections.',
    created_at: '2024-02-20T10:30:00Z',
  }
];

// Helper to safely access localStorage in SSR-safe manner
function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading key ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing key ${key} to localStorage:`, e);
  }
}

export const DataStore = {
  // Initializer
  init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setStoredItem(STORAGE_KEYS.USERS, SEED_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      setStoredItem(STORAGE_KEYS.COURSES, SEED_COURSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
      setStoredItem(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
      setStoredItem(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default initial session: Julian Sterling (viewer)
      setStoredItem(STORAGE_KEYS.CURRENT_USER, SEED_USERS[5]);
    }
  },

  // Auth & Profile methods
  getCurrentUser(): UserProfile | null {
    return getStoredItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: UserProfile | null) {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  getAllUsers(): UserProfile[] {
    return getStoredItem<UserProfile[]>(STORAGE_KEYS.USERS, SEED_USERS);
  },

  getUserByUsername(username: string): UserProfile | undefined {
    const users = this.getAllUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  getUserById(id: string): UserProfile | undefined {
    const users = this.getAllUsers();
    return users.find(u => u.id === id);
  },

  updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    setStoredItem(STORAGE_KEYS.USERS, users);
    
    const currentUser = this.getCurrentUser();
    if (currentUser?.id === userId) {
      this.setCurrentUser(users[index]);
    }
    return users[index];
  },

  registerUser(username: string, displayName: string, role: 'viewer' | 'creator' = 'viewer'): UserProfile {
    const users = this.getAllUsers();
    const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      throw new Error(`Username @${username} is already taken.`);
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      display_name: displayName,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: 'Lifelong learner on Saaboq.',
      expertise: [],
      is_creator: role === 'creator',
      role: role,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    setStoredItem(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  loginUser(username: string): UserProfile {
    const user = this.getUserByUsername(username);
    if (!user) {
      throw new Error(`Account @${username} not found. Please register.`);
    }
    this.setCurrentUser(user);
    return user;
  },

  logoutUser() {
    this.setCurrentUser(null);
  },

  // Courses methods
  getCourses(): Course[] {
    const courses = getStoredItem<Course[]>(STORAGE_KEYS.COURSES, SEED_COURSES);
    const users = this.getAllUsers();
    return courses.map(course => ({
      ...course,
      creator: users.find(u => u.id === course.creator_id),
    }));
  },

  getCourseById(id: string): Course | undefined {
    return this.getCourses().find(c => c.id === id);
  },

  createCourse(course: Omit<Course, 'id' | 'created_at' | 'total_lessons'>): Course {
    const courses = getStoredItem<Course[]>(STORAGE_KEYS.COURSES, SEED_COURSES);
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
      total_lessons: 0,
      created_at: new Date().toISOString(),
    };
    courses.push(newCourse);
    setStoredItem(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  },

  // Videos methods
  getVideos(): Video[] {
    const videos = getStoredItem<Video[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    const users = this.getAllUsers();
    const courses = getStoredItem<Course[]>(STORAGE_KEYS.COURSES, SEED_COURSES);

    return videos.map(video => ({
      ...video,
      creator: users.find(u => u.id === video.creator_id),
      course: courses.find(c => c.id === video.course_id),
    }));
  },

  getVideoById(id: string): Video | undefined {
    return this.getVideos().find(v => v.id === id);
  },

  getVideosByCreator(creatorId: string): Video[] {
    return this.getVideos().filter(v => v.creator_id === creatorId);
  },

  getCourseLessons(courseId: string): Video[] {
    return this.getVideos()
      .filter(v => v.course_id === courseId)
      .sort((a, b) => (a.lesson_order || 0) - (b.lesson_order || 0));
  },

  searchVideos(query: string, category?: string, difficulty?: string): Video[] {
    let results = this.getVideos().filter(v => v.visibility === 'public');

    if (category && category !== 'All') {
      results = results.filter(v => v.category.toLowerCase() === category.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      results = results.filter(v => v.difficulty === difficulty);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(v => 
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.creator?.display_name.toLowerCase().includes(q) ||
        v.creator?.username.toLowerCase().includes(q)
      );
    }

    return results;
  },

  publishVideo(videoData: Omit<Video, 'id' | 'created_at' | 'views_count' | 'likes_count'>): Video {
    const videos = getStoredItem<Video[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    const newVideo: Video = {
      ...videoData,
      id: `vid-${Date.now()}`,
      views_count: 0,
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
    videos.unshift(newVideo);
    setStoredItem(STORAGE_KEYS.VIDEOS, videos);

    // Update course lesson count if attached
    if (newVideo.course_id) {
      const courses = getStoredItem<Course[]>(STORAGE_KEYS.COURSES, SEED_COURSES);
      const cIndex = courses.findIndex(c => c.id === newVideo.course_id);
      if (cIndex !== -1) {
        courses[cIndex].total_lessons = (courses[cIndex].total_lessons || 0) + 1;
        setStoredItem(STORAGE_KEYS.COURSES, courses);
      }
    }

    return newVideo;
  },

  updateVideo(id: string, updates: Partial<Video>): Video | null {
    const videos = getStoredItem<Video[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    const index = videos.findIndex(v => v.id === id);
    if (index === -1) return null;

    videos[index] = { ...videos[index], ...updates };
    setStoredItem(STORAGE_KEYS.VIDEOS, videos);
    return videos[index];
  },

  deleteVideo(id: string, userId: string): boolean {
    const videos = getStoredItem<Video[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    const video = videos.find(v => v.id === id);
    if (!video) return false;

    // Check ownership or admin
    const user = this.getUserById(userId);
    if (video.creator_id !== userId && user?.role !== 'admin') {
      throw new Error('Unauthorized to delete this video.');
    }

    const filtered = videos.filter(v => v.id !== id);
    setStoredItem(STORAGE_KEYS.VIDEOS, filtered);
    return true;
  },

  recordView(videoId: string) {
    const videos = getStoredItem<Video[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    const index = videos.findIndex(v => v.id === videoId);
    if (index !== -1) {
      videos[index].views_count += 1;
      setStoredItem(STORAGE_KEYS.VIDEOS, videos);
    }
  },

  // Subscriptions
  isSubscribed(subscriberId: string, creatorId: string): boolean {
    const subs = getStoredItem<{ subscriber_id: string; creator_id: string }[]>(STORAGE_KEYS.SUBSCRIPTIONS, [
      { subscriber_id: 'user-viewer', creator_id: 'user-elena' }
    ]);
    return subs.some(s => s.subscriber_id === subscriberId && s.creator_id === creatorId);
  },

  toggleSubscription(subscriberId: string, creatorId: string): boolean {
    let subs = getStoredItem<{ subscriber_id: string; creator_id: string }[]>(STORAGE_KEYS.SUBSCRIPTIONS, [
      { subscriber_id: 'user-viewer', creator_id: 'user-elena' }
    ]);
    const exists = subs.some(s => s.subscriber_id === subscriberId && s.creator_id === creatorId);
    if (exists) {
      subs = subs.filter(s => !(s.subscriber_id === subscriberId && s.creator_id === creatorId));
      setStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, subs);
      return false;
    } else {
      subs.push({ subscriber_id: subscriberId, creator_id: creatorId });
      setStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, subs);
      return true;
    }
  },

  getSubscriberCount(creatorId: string): number {
    const subs = getStoredItem<{ subscriber_id: string; creator_id: string }[]>(STORAGE_KEYS.SUBSCRIPTIONS, [
      { subscriber_id: 'user-viewer', creator_id: 'user-elena' }
    ]);
    return subs.filter(s => s.creator_id === creatorId).length;
  },

  // Likes
  isVideoLiked(userId: string, videoId: string): boolean {
    const likes = getStoredItem<{ user_id: string; video_id: string }[]>(STORAGE_KEYS.LIKES, []);
    return likes.some(l => l.user_id === userId && l.video_id === videoId);
  },

  toggleLike(userId: string, videoId: string): { liked: boolean; count: number } {
    let likes = getStoredItem<{ user_id: string; video_id: string }[]>(STORAGE_KEYS.LIKES, []);
    const videos = getStoredItem<Video[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    const vIndex = videos.findIndex(v => v.id === videoId);

    const exists = likes.some(l => l.user_id === userId && l.video_id === videoId);
    let liked = false;

    if (exists) {
      likes = likes.filter(l => !(l.user_id === userId && l.video_id === videoId));
      if (vIndex !== -1 && videos[vIndex].likes_count > 0) {
        videos[vIndex].likes_count -= 1;
      }
      liked = false;
    } else {
      likes.push({ user_id: userId, video_id: videoId });
      if (vIndex !== -1) {
        videos[vIndex].likes_count += 1;
      }
      liked = true;
    }

    setStoredItem(STORAGE_KEYS.LIKES, likes);
    setStoredItem(STORAGE_KEYS.VIDEOS, videos);
    return {
      liked,
      count: vIndex !== -1 ? videos[vIndex].likes_count : 0,
    };
  },

  // Saved / Bookmarked Videos
  isSaved(userId: string, videoId: string): boolean {
    const saved = getStoredItem<{ user_id: string; video_id: string }[]>(STORAGE_KEYS.SAVED, []);
    return saved.some(s => s.user_id === userId && s.video_id === videoId);
  },

  toggleSave(userId: string, videoId: string): boolean {
    let saved = getStoredItem<{ user_id: string; video_id: string }[]>(STORAGE_KEYS.SAVED, []);
    const exists = saved.some(s => s.user_id === userId && s.video_id === videoId);
    if (exists) {
      saved = saved.filter(s => !(s.user_id === userId && s.video_id === videoId));
      setStoredItem(STORAGE_KEYS.SAVED, saved);
      return false;
    } else {
      saved.push({ user_id: userId, video_id: videoId });
      setStoredItem(STORAGE_KEYS.SAVED, saved);
      return true;
    }
  },

  getSavedVideos(userId: string): Video[] {
    const saved = getStoredItem<{ user_id: string; video_id: string }[]>(STORAGE_KEYS.SAVED, []);
    const userSavedIds = saved.filter(s => s.user_id === userId).map(s => s.video_id);
    return this.getVideos().filter(v => userSavedIds.includes(v.id));
  },

  // Watch History & Course Progress
  recordProgress(userId: string, videoId: string, progressSeconds: number, completed: boolean = false) {
    let history = getStoredItem<WatchProgress[]>(STORAGE_KEYS.HISTORY, []);
    const index = history.findIndex(h => h.user_id === userId && h.video_id === videoId);
    
    if (index !== -1) {
      history[index].progress_seconds = progressSeconds;
      history[index].completed = completed || history[index].completed;
      history[index].updated_at = new Date().toISOString();
    } else {
      history.push({
        user_id: userId,
        video_id: videoId,
        progress_seconds: progressSeconds,
        completed,
        updated_at: new Date().toISOString(),
      });
    }
    setStoredItem(STORAGE_KEYS.HISTORY, history);
  },

  getVideoProgress(userId: string, videoId: string): WatchProgress | undefined {
    const history = getStoredItem<WatchProgress[]>(STORAGE_KEYS.HISTORY, []);
    return history.find(h => h.user_id === userId && h.video_id === videoId);
  },

  getWatchHistory(userId: string): { video: Video; progress: WatchProgress }[] {
    const history = getStoredItem<WatchProgress[]>(STORAGE_KEYS.HISTORY, [])
      .filter(h => h.user_id === userId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    const videos = this.getVideos();
    return history
      .map(progress => {
        const video = videos.find(v => v.id === progress.video_id);
        return video ? { video, progress } : null;
      })
      .filter((item): item is { video: Video; progress: WatchProgress } => item !== null);
  },

  // Comments
  getCommentsForVideo(videoId: string): Comment[] {
    const comments = getStoredItem<Comment[]>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    const users = this.getAllUsers();
    return comments
      .filter(c => c.video_id === videoId)
      .map(c => ({
        ...c,
        user: users.find(u => u.id === c.user_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  addComment(videoId: string, userId: string, content: string): Comment {
    const comments = getStoredItem<Comment[]>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      video_id: videoId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
    };
    comments.push(newComment);
    setStoredItem(STORAGE_KEYS.COMMENTS, comments);
    return {
      ...newComment,
      user: this.getUserById(userId),
    };
  },

  deleteComment(commentId: string, userId: string): boolean {
    const comments = getStoredItem<Comment[]>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return false;

    const user = this.getUserById(userId);
    if (comment.user_id !== userId && user?.role !== 'admin') {
      throw new Error('Unauthorized to delete this comment.');
    }

    const filtered = comments.filter(c => c.id !== commentId);
    setStoredItem(STORAGE_KEYS.COMMENTS, filtered);
    return true;
  },

  // Moderation Reports
  submitReport(reporterId: string, contentType: 'video' | 'comment' | 'course', contentId: string, reason: string): ContentReport {
    const reports = getStoredItem<ContentReport[]>(STORAGE_KEYS.REPORTS, []);
    let contentTitle = '';
    if (contentType === 'video') {
      const v = this.getVideoById(contentId);
      contentTitle = v?.title || contentId;
    }
    const report: ContentReport = {
      id: `rep-${Date.now()}`,
      reporter_id: reporterId,
      content_type: contentType,
      content_id: contentId,
      content_title: contentTitle,
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    reports.push(report);
    setStoredItem(STORAGE_KEYS.REPORTS, reports);
    return report;
  },

  getReports(): ContentReport[] {
    return getStoredItem<ContentReport[]>(STORAGE_KEYS.REPORTS, []);
  },

  updateReportStatus(reportId: string, status: 'resolved' | 'dismissed', notes?: string): ContentReport | null {
    const reports = getStoredItem<ContentReport[]>(STORAGE_KEYS.REPORTS, []);
    const index = reports.findIndex(r => r.id === reportId);
    if (index === -1) return null;

    reports[index].status = status;
    if (notes) reports[index].resolution_notes = notes;
    setStoredItem(STORAGE_KEYS.REPORTS, reports);
    return reports[index];
  }
};
