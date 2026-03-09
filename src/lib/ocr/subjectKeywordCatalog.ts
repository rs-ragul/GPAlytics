/**
 * College subject keyword catalog.
 *
 * Add/modify entries here with your college's exact subject names and related keywords.
 * Matching prefers these entries before generic fuzzy matching.
 */

export interface SubjectKeywordEntry {
  name: string;
  keywords: string[];
}

export const SUBJECT_KEYWORD_CATALOG: SubjectKeywordEntry[] = [
  {
    name: 'Professional English and Functional Skills',
    keywords: ['professional', 'english', 'functional', 'skills'],
  },
  {
    name: 'Technical English',
    keywords: ['technical', 'english'],
  },
  {
    name: 'Calculus for Engineers',
    keywords: ['calculus', 'engineers', 'engineering', 'math'],
  },
  {
    name: 'Engineering Physics',
    keywords: ['engineering', 'physics'],
  },
  {
    name: 'Engineering Chemistry',
    keywords: ['engineering', 'chemistry'],
  },
  {
    name: 'Physics and Chemistry Laboratory',
    keywords: ['physics', 'chemistry', 'laboratory', 'lab'],
  },
  {
    name: 'Problem Solving and Python Programming',
    keywords: ['problem', 'solving', 'python', 'programming'],
  },
  {
    name: 'Problem Solving and Python Programming Laboratory',
    keywords: ['python', 'programming', 'laboratory', 'lab'],
  },
  {
    name: 'Heritage of Tamils',
    keywords: ['heritage', 'tamils', 'tamil'],
  },
  {
    name: 'Environmental Science',
    keywords: ['environmental', 'science', 'environment'],
  },
  {
    name: 'Data Structures and Algorithms',
    keywords: ['data', 'structures', 'algorithms', 'dsa'],
  },
  {
    name: 'Database Management Systems',
    keywords: ['database', 'management', 'systems', 'dbms'],
  },
  {
    name: 'Computer Networks',
    keywords: ['computer', 'networks', 'networking'],
  },
  {
    name: 'Operating Systems',
    keywords: ['operating', 'systems', 'os'],
  },
  {
    name: 'Software Engineering',
    keywords: ['software', 'engineering'],
  },
  {
    name: 'Theory of Computation',
    keywords: ['theory', 'computation', 'toc'],
  },
  {
    name: 'Artificial Intelligence',
    keywords: ['artificial', 'intelligence', 'ai'],
  },
  {
    name: 'Machine Learning',
    keywords: ['machine', 'learning', 'ml'],
  },
  {
    name: 'Data Science',
    keywords: ['data', 'science'],
  },
  {
    name: 'Cyber Security',
    keywords: ['cyber', 'security'],
  },
  {
    name: 'Cloud Computing',
    keywords: ['cloud', 'computing'],
  },
  {
    name: 'Internet of Things',
    keywords: ['internet', 'things', 'iot'],
  },
  {
    name: 'Web Development',
    keywords: ['web', 'development'],
  },
  {
    name: 'Mobile Application Development',
    keywords: ['mobile', 'application', 'development', 'app'],
  },
  {
    name: 'Engineering Graphics',
    keywords: ['engineering', 'graphics'],
  },
  {
    name: 'Workshop Practice',
    keywords: ['workshop', 'practice'],
  },
  {
    name: 'Engineering Mechanics',
    keywords: ['engineering', 'mechanics'],
  },
  {
    name: 'Digital Logic Design',
    keywords: ['digital', 'logic', 'design'],
  },
  {
    name: 'Data Structures Laboratory',
    keywords: ['data', 'structures', 'laboratory', 'lab'],
  },
  {
    name: 'Database Laboratory',
    keywords: ['database', 'laboratory', 'lab'],
  },
  {
    name: 'Networks Laboratory',
    keywords: ['networks', 'laboratory', 'lab'],
  },
  {
    name: 'Operating Systems Laboratory',
    keywords: ['operating', 'systems', 'laboratory', 'lab'],
  },
  {
    name: 'Machine Learning Laboratory',
    keywords: ['machine', 'learning', 'laboratory', 'lab'],
  },
];
