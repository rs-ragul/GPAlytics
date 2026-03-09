/**
 * Subject Credits Database
 * Maps subject names to their credit values
 */

import { SUBJECT_KEYWORD_CATALOG } from './subjectKeywordCatalog';

export interface SubjectCatalogEntry {
  name: string;
  credits: number;
  keywords?: string[];
}

export const DEFAULT_CREDITS = 3;

// Comprehensive subject credits mapping
export const SUBJECT_CREDITS_MAP: Record<string, number> = {
  // English & Communication
  'Professional English and Functional Skills': 4,
  'Technical English': 4,
  'English': 3,
  'Professional English': 3,
  'Communicative English': 2,
  'English for Engineers': 3,
  'Advanced English': 3,
  
  // Mathematics
  'Calculus for Engineers': 4,
  'Calculus': 4,
  'Mathematics': 4,
  'Engineering Mathematics': 4,
  'Discrete Mathematics': 3,
  'Linear Algebra': 3,
  'Probability and Statistics': 3,
  'Numerical Methods': 3,
  'Complex Analysis': 3,
  'Differential Equations': 3,
  'Transforms and Partial Differential Equations': 4,
  'Applied Mathematics': 4,
  'Engineering Mathematics I': 4,
  'Engineering Mathematics II': 4,
  'Engineering Mathematics III': 4,
  
  // Physics
  'Engineering Physics': 3,
  'Physics': 3,
  'Physics and Chemistry Laboratory': 2,
  'Applied Physics': 3,
  'Classical Physics': 3,
  'Modern Physics': 3,
  'Optoelectronics': 3,
  'Laser Physics': 3,
  'Quantum Mechanics': 3,
  'Solid State Physics': 3,
  
  // Chemistry
  'Engineering Chemistry': 3,
  'Chemistry': 3,
  'Applied Chemistry': 3,
  'Organic Chemistry': 3,
  'Physical Chemistry': 3,
  'Environmental Chemistry': 3,
  
  // Computer Science Core
  'Problem Solving and Python Programming': 3,
  'Problem Solving and Python Programming Laboratory': 2,
  'Data Structures and Algorithms': 4,
  'Database Management Systems': 3,
  'Computer Networks': 3,
  'Operating Systems': 3,
  'Software Engineering': 3,
  'Theory of Computation': 3,
  'Artificial Intelligence': 3,
  'Machine Learning': 3,
  'Data Science': 3,
  'Cyber Security': 3,
  'Cloud Computing': 3,
  'Web Development': 3,
  'Mobile Application Development': 3,
  'Internet of Things': 3,
  'Blockchain Technology': 3,
  'Computer Architecture': 3,
  'Microprocessors and Microcontrollers': 3,
  'Embedded Systems': 3,
  'Digital Signal Processing': 3,
  'Computer Graphics': 3,
  'Design and Analysis of Algorithms': 4,
  'Cryptography and Network Security': 3,
  'Distributed Computing': 3,
  'Big Data Analytics': 3,
  'Data Mining': 3,
  'Artificial Intelligence and Machine Learning': 4,
  'Internet of Things and Applications': 3,
  'Cloud Services and Architecture': 3,
  'Full Stack Development': 3,
  'DevOps': 3,
  'Software Testing': 3,
  'Software Project Management': 3,
  'Agile Methodologies': 3,
  
  // Engineering Common
  'Heritage of Tamils': 1,
  'Tamils and Technology': 1,
  'Environmental Science': 2,
  'Environmental Engineering': 3,
  'Engineering Graphics': 3,
  'Workshop Practice': 2,
  'Engineering Mechanics': 3,
  'Electric Circuit Theory': 3,
  'Electronic Devices': 3,
  'Digital Logic Design': 3,
  'Electrical Machines': 3,
  'Power Systems': 3,
  'Control Systems': 3,
  'Measurements and Instrumentation': 3,
  'Sensors and Transducers': 3,
  'Robotics and Automation': 3,
  'Finite Element Analysis': 3,
  'Engineering Design': 3,
  'Product Development': 3,
  
  // Labs
  'Data Structures Laboratory': 2,
  'Database Laboratory': 2,
  'Networks Laboratory': 2,
  'Operating Systems Laboratory': 2,
  'Software Development Laboratory': 2,
  'Machine Learning Laboratory': 2,
  'Python Laboratory': 2,
  'Physics Laboratory': 2,
  'Chemistry Laboratory': 2,
  'Engineering Graphics Laboratory': 2,
  'Workshop Practice Laboratory': 2,
  'Internet of Things Laboratory': 2,
  'Cloud Computing Laboratory': 2,
  'Mobile Application Development Laboratory': 2,
  'Web Development Laboratory': 2,
  'Cyber Security Laboratory': 2,
  'Software Engineering Laboratory': 2,
  
  // Professional Skills
  'Professional Ethics': 2,
  'Engineering Economics': 3,
  'Intellectual Property Rights': 2,
  'Entrepreneurship Development': 3,
  'Total Quality Management': 3,
  'Industrial Management': 3,
  
  // Open Electives / Generic
  'Open Elective': 3,
  'Elective': 3,
  'Audit Course': 0,

  // Computer Science / IT
  'Object Oriented Programming': 3,
  'Object Oriented Analysis and Design': 3,
  'Java Programming': 3,
  'Programming in C': 3,
  'Programming in C++': 3,
  'Advanced Java': 3,
  'Compiler Design': 3,
  'Parallel Computing': 3,
  'High Performance Computing': 3,
  'Human Computer Interaction': 3,
  'Information Retrieval': 3,
  'Natural Language Processing': 3,
  'Deep Learning': 3,
  'Reinforcement Learning': 3,
  'Software Architecture': 3,
  'Software Project': 2,
  'Mini Project': 2,
  'Major Project': 8,
  'Information Security': 3,
  'Ethical Hacking': 3,
  'Data Visualization': 3,
  'Business Intelligence': 3,
  'Computer Vision': 3,
  'Distributed Systems': 3,
  'Digital Image Processing': 3,
  'Cloud Native Development': 3,
  'DevSecOps': 3,
  'Data Warehousing and Mining': 3,

  // Electronics and Communication
  'Analog Electronics': 3,
  'Electronic Circuits': 3,
  'Signals and Systems': 3,
  'Communication Systems': 3,
  'Digital Communication': 3,
  'Microcontrollers and Applications': 3,
  'VLSI Design': 3,
  'Embedded and Real Time Systems': 3,
  'Antenna and Wave Propagation': 3,
  'Microwave Engineering': 3,
  'Control Engineering': 3,
  'Linear Integrated Circuits': 3,
  'Digital Signal Processors': 3,
  'Communication Laboratory': 2,
  'VLSI Laboratory': 2,
  'Embedded Systems Laboratory': 2,

  // Electrical and Electronics
  'Electrical Circuits': 3,
  'Power Electronics': 3,
  'Power System Analysis': 3,
  'Electrical Machines I': 3,
  'Electrical Machines II': 3,
  'Transmission and Distribution': 3,
  'Renewable Energy Systems': 3,
  'Smart Grid': 3,
  'Protection and Switchgear': 3,
  'Electrical Drives': 3,
  'Power Systems Laboratory': 2,
  'Electrical Machines Laboratory': 2,

  // Mechanical Engineering
  'Engineering Thermodynamics': 3,
  'Fluid Mechanics': 3,
  'Strength of Materials': 3,
  'Manufacturing Technology': 3,
  'Heat and Mass Transfer': 3,
  'Theory of Machines': 3,
  'Machine Design': 3,
  'Dynamics of Machinery': 3,
  'Metrology and Measurements': 3,
  'CNC Technology': 3,
  'Automobile Engineering': 3,
  'Industrial Engineering': 3,
  'Total Quality Control': 3,
  'CAD CAM': 3,
  'Finite Element Methods': 3,
  'Thermal Engineering': 3,
  'Mechanical Vibrations': 3,
  'Refrigeration and Air Conditioning': 3,
  'Production Planning and Control': 3,
  'Thermal Laboratory': 2,
  'Manufacturing Laboratory': 2,
  'Machine Drawing': 2,

  // Civil Engineering
  'Surveying': 3,
  'Building Materials and Construction': 3,
  'Structural Analysis': 3,
  'Concrete Technology': 3,
  'Design of Reinforced Concrete Structures': 3,
  'Design of Steel Structures': 3,
  'Soil Mechanics': 3,
  'Foundation Engineering': 3,
  'Transportation Engineering': 3,
  'Hydrology and Water Resources Engineering': 3,
  'Environmental Engineering I': 3,
  'Environmental Engineering II': 3,
  'Estimation and Costing': 3,
  'Construction Planning and Management': 3,
  'Geotechnical Engineering': 3,
  'Open Channel Hydraulics': 3,
  'Irrigation Engineering': 3,
  'Structural Dynamics': 3,
  'Highway Engineering': 3,
  'Concrete and Highway Laboratory': 2,
  'Survey Laboratory': 2,

  // Chemical / Biotechnology
  'Chemical Process Calculations': 3,
  'Chemical Engineering Thermodynamics': 3,
  'Mass Transfer': 3,
  'Heat Transfer': 3,
  'Process Dynamics and Control': 3,
  'Reaction Engineering': 3,
  'Biochemistry': 3,
  'Cell Biology': 3,
  'Genetic Engineering': 3,
  'Molecular Biology': 3,
  'Microbiology': 3,
  'Bioprocess Engineering': 3,
  'Immunology': 3,
  'Bioinformatics': 3,
  'Downstream Processing': 3,
  'Biotechnology Laboratory': 2,

  // Aerospace / Automobile
  'Aerodynamics': 3,
  'Aircraft Structures': 3,
  'Propulsion': 3,
  'Flight Mechanics': 3,
  'Avionics': 3,
  'Automotive Electrical and Electronics': 3,
  'Vehicle Dynamics': 3,
  'Automotive Chassis and Transmission': 3,

  // Mathematics and Statistics
  'Real Analysis': 3,
  'Complex Variables': 3,
  'Abstract Algebra': 3,
  'Graph Theory': 3,
  'Operations Research': 3,
  'Mathematical Statistics': 3,
  'Stochastic Processes': 3,
  'Optimization Techniques': 3,
  'Actuarial Mathematics': 3,

  // Physics
  'Classical Mechanics': 3,
  'Electromagnetic Theory': 3,
  'Statistical Mechanics': 3,
  'Nuclear Physics': 3,
  'Particle Physics': 3,
  'Condensed Matter Physics': 3,
  'Astrophysics': 3,
  'Electronics': 3,
  'Physics Practical': 2,

  // Chemistry
  'Inorganic Chemistry': 3,
  'Analytical Chemistry': 3,
  'Industrial Chemistry': 3,
  'Polymer Chemistry': 3,
  'Medicinal Chemistry': 3,
  'Chemistry Practical': 2,

  // Commerce and Management
  'Financial Accounting': 3,
  'Corporate Accounting': 3,
  'Cost Accounting': 3,
  'Management Accounting': 3,
  'Income Tax': 3,
  'GST and Customs Law': 3,
  'Business Law': 3,
  'Company Law': 3,
  'Auditing': 3,
  'Banking Theory Law and Practice': 3,
  'Business Economics': 3,
  'Business Statistics': 3,
  'Business Mathematics': 3,
  'Marketing Management': 3,
  'Human Resource Management': 3,
  'Financial Management': 3,
  'Operations Management': 3,
  'Strategic Management': 3,
  'Organizational Behaviour': 3,
  'Business Communication': 3,
  'Entrepreneurship': 3,
  'Supply Chain Management': 3,
  'International Business': 3,
  'Retail Management': 3,
  'Consumer Behaviour': 3,

  // Economics
  'Microeconomics': 3,
  'Macroeconomics': 3,
  'Econometrics': 3,
  'Public Finance': 3,
  'International Economics': 3,
  'Development Economics': 3,
  'Monetary Economics': 3,

  // Arts and Humanities
  'English Literature': 3,
  'History of English Literature': 3,
  'Indian Writing in English': 3,
  'Linguistics': 3,
  'Journalism and Mass Communication': 3,
  'Political Science': 3,
  'Public Administration': 3,
  'Sociology': 3,
  'Psychology': 3,
  'Philosophy': 3,
  'Indian History': 3,
  'World History': 3,
  'Geography': 3,
  'Tamil': 3,
  'Hindi': 3,
  'French': 3,

  // Life Sciences
  'Botany': 3,
  'Zoology': 3,
  'Ecology': 3,
  'Genetics': 3,
  'Environmental Biology': 3,
  'Biostatistics': 3,

  // Medical and Allied Health
  'Anatomy': 4,
  'Physiology': 4,
  'Pathology': 3,
  'Pharmacology': 3,
  'Microbiology for Health Sciences': 3,
  'Community Medicine': 3,
  'Nursing Foundation': 4,
  'Medical Surgical Nursing': 4,
  'Pediatric Nursing': 3,
  'Obstetrics and Gynecological Nursing': 3,
  'Mental Health Nursing': 3,
  'Clinical Posting': 2,

  // Law
  'Constitutional Law': 4,
  'Law of Contracts': 4,
  'Law of Torts': 3,
  'Criminal Law': 4,
  'Family Law': 3,
  'Property Law': 3,
  'Administrative Law': 3,
  'Jurisprudence': 3,
  'Labour Law': 3,
  'Intellectual Property Law': 3,

  // Agriculture and Food
  'Soil Science': 3,
  'Agronomy': 3,
  'Horticulture': 3,
  'Plant Pathology': 3,
  'Agricultural Economics': 3,
  'Food Technology': 3,
  'Food Processing': 3,
  'Food Chemistry': 3,
  'Food Microbiology': 3,

  // Architecture and Design
  'Architectural Design': 4,
  'Building Construction and Materials': 3,
  'History of Architecture': 3,
  'Theory of Architecture': 3,
  'Urban Planning': 3,
  'Landscape Architecture': 3,
  'Interior Design': 3,
  'Visual Communication': 3,
  'Design Thinking': 3,

  // Common Skills / Value Added
  'Soft Skills': 2,
  'Aptitude and Reasoning': 2,
  'Employability Skills': 2,
  'Internship': 2,
  'Industrial Training': 2,
  'Seminar': 1,
  'Comprehensive Viva': 1,
  'Project Work': 6,
};

let runtimeCreditsMap: Record<string, number> = { ...SUBJECT_CREDITS_MAP };
let runtimeKeywordCatalog = [...SUBJECT_KEYWORD_CATALOG];
let catalogLoadPromise: Promise<void> | null = null;

/**
 * Load external subject catalog from /public/subject-catalog.json.
 * The external file is optional and merged with built-in catalog.
 */
export async function initializeSubjectCatalog(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (catalogLoadPromise) return catalogLoadPromise;

  catalogLoadPromise = (async () => {
    try {
      const response = await fetch('/subject-catalog.json', { cache: 'no-store' });
      if (!response.ok) return;

      const data = await response.json();
      const entries = normalizeCatalogPayload(data);
      if (entries.length === 0) return;

      const mergedCredits = { ...runtimeCreditsMap };
      const mergedKeywords = [...runtimeKeywordCatalog];

      for (const entry of entries) {
        mergedCredits[entry.name] = entry.credits;

        if (entry.keywords && entry.keywords.length > 0) {
          mergedKeywords.push({
            name: entry.name,
            keywords: entry.keywords,
          });
        }
      }

      runtimeCreditsMap = mergedCredits;
      runtimeKeywordCatalog = dedupeKeywordCatalog(mergedKeywords);
    } catch {
      // Keep built-in catalog when external file is unavailable.
    }
  })();

  return catalogLoadPromise;
}

/**
 * Get credits for a subject name using fuzzy matching
 */
export function getSubjectCredits(subjectName: string): number {
  if (!subjectName) return DEFAULT_CREDITS;
  
  // Normalize the subject name
  const normalized = subjectName.toLowerCase().trim();
  
  // First, try exact match
  if (runtimeCreditsMap[subjectName]) {
    return runtimeCreditsMap[subjectName];
  }
  
  // Try case-insensitive exact match
  for (const [key, credits] of Object.entries(runtimeCreditsMap)) {
    if (key.toLowerCase() === normalized) {
      return credits;
    }
  }
  
  // Try partial match (subject name contains key or vice versa)
  let bestMatch = { key: '', credits: DEFAULT_CREDITS, score: 0 };
  
  for (const [key, credits] of Object.entries(runtimeCreditsMap)) {
    const keyLower = key.toLowerCase();
    
    // Check various matching scenarios
    let score = 0;
    
    // Exact substring match
    if (normalized.includes(keyLower) || keyLower.includes(normalized)) {
      score = 1;
    }
    
    // Word-based matching (for subject names with multiple words)
    const normalizedWords = normalized.split(/\s+/);
    const keyWords = keyLower.split(/\s+/);
    
    const matchingWords = normalizedWords.filter(w => 
      w.length > 2 && keyWords.some(k => k.includes(w) || w.includes(k))
    );
    
    if (matchingWords.length > 0) {
      const wordScore = matchingWords.length / Math.max(normalizedWords.length, keyWords.length);
      score = Math.max(score, wordScore);
    }
    
    if (score > bestMatch.score) {
      bestMatch = { key, credits, score };
    }
  }
  
  // Only return if we have a good match (score > 0.5)
  if (bestMatch.score > 0.5) {
    return bestMatch.credits;
  }
  
  return DEFAULT_CREDITS;
}

/**
 * Check if a subject likely has practical/lab component based on name
 */
export function isLabSubject(subjectName: string): boolean {
  const labKeywords = ['laboratory', 'lab', 'practical', 'workshop', 'practice'];
  const lowerName = subjectName.toLowerCase();
  
  return labKeywords.some(keyword => lowerName.includes(keyword));
}

/**
 * Get common subject variations (for better matching)
 */
export function getSubjectVariations(subjectName: string): string[] {
  const variations: string[] = [subjectName];
  
  // Add variations based on common patterns
  if (subjectName.toLowerCase().includes('engineering')) {
    variations.push(subjectName.replace(/engineering\s+/i, ''));
  }
  
  if (subjectName.toLowerCase().includes('computer')) {
    variations.push(subjectName.replace(/computer\s+/i, 'CS '));
  }
  
  return variations;
}

/**
 * Suggest a canonical subject name from known catalog when OCR text is noisy.
 */
export function suggestCanonicalSubjectName(subjectName: string): string {
  const normalized = normalizeForMatch(subjectName);
  if (!normalized) return subjectName;

  // 1) Deterministic keyword catalog match (college-configurable file).
  const catalogMatch = findBestCatalogMatch(normalized);
  if (catalogMatch && catalogMatch.score >= 0.6) {
    return catalogMatch.name;
  }

  let bestKey = subjectName;
  let bestScore = 0;

  const sourceWords = normalized.split(' ').filter((w) => w.length > 1);

  for (const key of Object.keys(runtimeCreditsMap)) {
    const keyNorm = key.toLowerCase();
    if (keyNorm === normalized) {
      return key;
    }

    const keyWords = keyNorm.split(' ').filter((w) => w.length > 1);
    const overlap = sourceWords.filter((word) => keyWords.some((kw) => kw.includes(word) || word.includes(kw))).length;
    const score = overlap / Math.max(sourceWords.length, keyWords.length, 1);

    if (normalized.includes(keyNorm) || keyNorm.includes(normalized)) {
      if (score < 0.9 && keyNorm.includes('engineering') && normalized.includes('engineering')) {
        // Boost common OCR-corrupted engineering subject names.
        bestKey = key;
        bestScore = 0.9;
        continue;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  // Keep matching broad enough for product-scale OCR noise while avoiding random replacements.
  return bestScore >= 0.58 ? bestKey : subjectName;
}

function findBestCatalogMatch(normalizedInput: string): { name: string; score: number } | null {
  const inputWords = normalizedInput.split(' ').filter((w) => w.length > 1);
  let best: { name: string; score: number } | null = null;

  for (const entry of runtimeKeywordCatalog) {
    const keywordHits = entry.keywords.filter((k) =>
      inputWords.some((w) => w.includes(k) || k.includes(w))
    ).length;

    const normalizedName = normalizeForMatch(entry.name);
    let score = keywordHits / Math.max(entry.keywords.length, 1);

    if (normalizedInput.includes(normalizedName) || normalizedName.includes(normalizedInput)) {
      score = Math.max(score, 0.9);
    }

    const overlapWords = inputWords.filter((w) => normalizedName.includes(w)).length;
    if (overlapWords >= Math.max(2, Math.floor(inputWords.length * 0.7))) {
      score = Math.max(score, 0.82);
    }

    if (!best || score > best.score) {
      best = { name: entry.name, score };
    }
  }

  return best;
}

function normalizeCatalogPayload(data: unknown): SubjectCatalogEntry[] {
  const source = Array.isArray(data)
    ? data
    : Array.isArray((data as { subjects?: unknown[] })?.subjects)
      ? (data as { subjects: unknown[] }).subjects
      : [];

  const output: SubjectCatalogEntry[] = [];

  for (const raw of source) {
    const item = raw as Partial<SubjectCatalogEntry>;
    const name = typeof item.name === 'string' ? item.name.trim() : '';
    const credits = typeof item.credits === 'number' ? item.credits : NaN;
    const keywords = Array.isArray(item.keywords)
      ? item.keywords.filter((k): k is string => typeof k === 'string' && k.trim().length > 0)
      : [];

    if (!name || !Number.isFinite(credits) || credits <= 0) continue;

    output.push({
      name,
      credits: Math.round(credits),
      keywords,
    });
  }

  return output;
}

function dedupeKeywordCatalog(entries: Array<{ name: string; keywords: string[] }>) {
  const seen = new Map<string, { name: string; keywords: string[] }>();

  for (const entry of entries) {
    const key = entry.name.toLowerCase();
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, {
        name: entry.name,
        keywords: Array.from(new Set(entry.keywords.map((k) => k.toLowerCase()))),
      });
      continue;
    }

    existing.keywords = Array.from(
      new Set([...existing.keywords, ...entry.keywords.map((k) => k.toLowerCase())])
    );
  }

  return Array.from(seen.values());
}

function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

