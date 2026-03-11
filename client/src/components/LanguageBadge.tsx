import React from 'react';

interface LanguageBadgeProps {
  language: string;
  size?: 'sm' | 'md';
}

/**
 * Language Badge Component
 * Displays color-coded badges for programming languages
 * Design: Modern Dashboard Elegance with indigo/cyan palette
 */

// Color mapping for popular programming languages
const languageColors: Record<string, { bg: string; text: string; border: string }> = {
  // Web Technologies
  'JavaScript': { bg: '#f7df1e', text: '#000000', border: '#f7df1e' },
  'TypeScript': { bg: '#3178c6', text: '#ffffff', border: '#3178c6' },
  'Python': { bg: '#3776ab', text: '#ffffff', border: '#3776ab' },
  'Java': { bg: '#007396', text: '#ffffff', border: '#007396' },
  'C++': { bg: '#00599c', text: '#ffffff', border: '#00599c' },
  'C#': { bg: '#239120', text: '#ffffff', border: '#239120' },
  'PHP': { bg: '#777bb4', text: '#ffffff', border: '#777bb4' },
  'Ruby': { bg: '#cc342d', text: '#ffffff', border: '#cc342d' },
  'Go': { bg: '#00add8', text: '#000000', border: '#00add8' },
  'Rust': { bg: '#ce422b', text: '#ffffff', border: '#ce422b' },
  'Kotlin': { bg: '#7f52ff', text: '#ffffff', border: '#7f52ff' },
  'Swift': { bg: '#fa7343', text: '#ffffff', border: '#fa7343' },
  'Objective-C': { bg: '#438eff', text: '#ffffff', border: '#438eff' },
  'R': { bg: '#276dc3', text: '#ffffff', border: '#276dc3' },
  'MATLAB': { bg: '#0076a8', text: '#ffffff', border: '#0076a8' },
  'Scala': { bg: '#dc322f', text: '#ffffff', border: '#dc322f' },
  'Haskell': { bg: '#5e5086', text: '#ffffff', border: '#5e5086' },
  'Clojure': { bg: '#db5945', text: '#ffffff', border: '#db5945' },
  'Elixir': { bg: '#6e4a7e', text: '#ffffff', border: '#6e4a7e' },
  'Erlang': { bg: '#a90533', text: '#ffffff', border: '#a90533' },
  'Perl': { bg: '#39457e', text: '#ffffff', border: '#39457e' },
  'Lua': { bg: '#000080', text: '#ffffff', border: '#000080' },
  'Groovy': { bg: '#e69f56', text: '#ffffff', border: '#e69f56' },
  'Dart': { bg: '#00b4ab', text: '#ffffff', border: '#00b4ab' },
  'Julia': { bg: '#9558b2', text: '#ffffff', border: '#9558b2' },
  'Shell': { bg: '#89e051', text: '#000000', border: '#89e051' },
  'Bash': { bg: '#4eaa25', text: '#ffffff', border: '#4eaa25' },
  'PowerShell': { bg: '#012456', text: '#ffffff', border: '#012456' },
  'HTML': { bg: '#e34c26', text: '#ffffff', border: '#e34c26' },
  'CSS': { bg: '#563d7c', text: '#ffffff', border: '#563d7c' },
  'SCSS': { bg: '#c6538c', text: '#ffffff', border: '#c6538c' },
  'LESS': { bg: '#1d365d', text: '#ffffff', border: '#1d365d' },
  'Sass': { bg: '#c6538c', text: '#ffffff', border: '#c6538c' },
  'SQL': { bg: '#336791', text: '#ffffff', border: '#336791' },
  'GraphQL': { bg: '#e10098', text: '#ffffff', border: '#e10098' },
  'JSON': { bg: '#000000', text: '#ffffff', border: '#000000' },
  'YAML': { bg: '#cb171e', text: '#ffffff', border: '#cb171e' },
  'XML': { bg: '#ff6600', text: '#ffffff', border: '#ff6600' },
  'Markdown': { bg: '#083fa1', text: '#ffffff', border: '#083fa1' },
  'Vue': { bg: '#4fc08d', text: '#ffffff', border: '#4fc08d' },
  'React': { bg: '#61dafb', text: '#000000', border: '#61dafb' },
  'Angular': { bg: '#dd0031', text: '#ffffff', border: '#dd0031' },
  'Svelte': { bg: '#ff3e00', text: '#ffffff', border: '#ff3e00' },
  'Next.js': { bg: '#000000', text: '#ffffff', border: '#000000' },
  'Nuxt': { bg: '#00c58e', text: '#ffffff', border: '#00c58e' },
  'Django': { bg: '#092e20', text: '#ffffff', border: '#092e20' },
  'Flask': { bg: '#000000', text: '#ffffff', border: '#000000' },
  'FastAPI': { bg: '#009688', text: '#ffffff', border: '#009688' },
  'Express': { bg: '#000000', text: '#ffffff', border: '#000000' },
  'Spring': { bg: '#6db33f', text: '#ffffff', border: '#6db33f' },
  'Laravel': { bg: '#ff2d20', text: '#ffffff', border: '#ff2d20' },
  'Rails': { bg: '#cc0000', text: '#ffffff', border: '#cc0000' },
  'ASP.NET': { bg: '#512bd4', text: '#ffffff', border: '#512bd4' },
  'Node.js': { bg: '#68a063', text: '#ffffff', border: '#68a063' },
  'Deno': { bg: '#000000', text: '#ffffff', border: '#000000' },
  'Docker': { bg: '#2496ed', text: '#ffffff', border: '#2496ed' },
  'Kubernetes': { bg: '#326ce5', text: '#ffffff', border: '#326ce5' },
  'AWS': { bg: '#ff9900', text: '#000000', border: '#ff9900' },
  'Azure': { bg: '#0078d4', text: '#ffffff', border: '#0078d4' },
  'GCP': { bg: '#4285f4', text: '#ffffff', border: '#4285f4' },
  'Firebase': { bg: '#ffa000', text: '#000000', border: '#ffa000' },
  'MongoDB': { bg: '#13aa52', text: '#ffffff', border: '#13aa52' },
  'PostgreSQL': { bg: '#336791', text: '#ffffff', border: '#336791' },
  'MySQL': { bg: '#00758f', text: '#ffffff', border: '#00758f' },
  'Redis': { bg: '#dc382d', text: '#ffffff', border: '#dc382d' },
  'Elasticsearch': { bg: '#005571', text: '#ffffff', border: '#005571' },
  'TensorFlow': { bg: '#ff6f00', text: '#ffffff', border: '#ff6f00' },
  'PyTorch': { bg: '#ee4c2c', text: '#ffffff', border: '#ee4c2c' },
  'Scikit-learn': { bg: '#f7931e', text: '#000000', border: '#f7931e' },
  'Pandas': { bg: '#150458', text: '#ffffff', border: '#150458' },
  'NumPy': { bg: '#013243', text: '#ffffff', border: '#013243' },
  'OpenCV': { bg: '#5c3ee1', text: '#ffffff', border: '#5c3ee1' },
};

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({ language, size = 'md' }) => {
  const colors = languageColors[language] || {
    bg: '#6366f1',
    text: '#ffffff',
    border: '#6366f1',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap transition-all duration-200 hover:scale-110 ${sizeClasses}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
      title={language}
    >
      {language}
    </span>
  );
};

/**
 * Get languages for a repository
 * This function maps repository names to their primary languages
 * In a real application, this would come from the GitHub API
 */
export const getRepositoryLanguages = (repoName: string): string[] => {
  const languageMap: Record<string, string[]> = {
    'Disease-Prediction-ML': ['Python', 'Jupyter Notebook', 'Scikit-learn'],
    'dristhi': ['JavaScript', 'React', 'Node.js'],
    '-LearnToEarn.project': ['Python', 'Django', 'PostgreSQL'],
  };

  return languageMap[repoName] || ['JavaScript'];
};

export default LanguageBadge;
