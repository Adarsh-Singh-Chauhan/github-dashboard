import { useEffect, useState } from 'react';
import { Github, Star, GitFork, Eye, Users, Calendar, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UserProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  email: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
}

interface Repository {
  name: string;
  description: string;
  stargazerCount: number;
  updatedAt: string;
  html_url?: string;
}

/**
 * GitHub Dashboard Home Page
 * Design: Modern Dashboard Elegance
 * - Glassmorphic cards with indigo/cyan palette
 * - Smooth animations and micro-interactions
 * - Responsive grid layout with staggered entrance
 */
export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch GitHub data from the report
    const mockProfile: UserProfile = {
      login: 'Adarsh-Singh-Chauhan',
      name: 'Adarsh Singh',
      avatar_url: 'https://avatars.githubusercontent.com/u/175235397?v=4',
      bio: 'Developer passionate about building innovative solutions',
      email: 'adarshsinghchauhan904@gmail.com',
      followers: 1,
      following: 4,
      public_repos: 3,
      created_at: '2024-07-10T15:15:43Z',
      html_url: 'https://github.com/Adarsh-Singh-Chauhan',
    };

    const mockRepos: Repository[] = [
      {
        name: 'Disease-Prediction-ML',
        description: 'ML based disease prediction project',
        stargazerCount: 1,
        updatedAt: '2026-02-25T21:29:33Z',
        html_url: 'https://github.com/Adarsh-Singh-Chauhan/Disease-Prediction-ML',
      },
      {
        name: 'dristhi',
        description: 'A comprehensive project repository',
        stargazerCount: 0,
        updatedAt: '2025-10-13T14:52:21Z',
        html_url: 'https://github.com/Adarsh-Singh-Chauhan/dristhi',
      },
      {
        name: '-LearnToEarn.project',
        description: 'Educational learning platform',
        stargazerCount: 0,
        updatedAt: '2024-12-21T09:03:23Z',
        html_url: 'https://github.com/Adarsh-Singh-Chauhan/-LearnToEarn.project',
      },
    ];

    setProfile(mockProfile);
    setRepos(mockRepos);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your GitHub dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663420708640/TkDa2nHLW9JFsmuxJkRCvR/github-dashboard-hero-YQZnMKHCULpvRXZ2NjVqeG.webp"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Github className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
              GitHub Dashboard
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Showcasing your GitHub profile and repository insights
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card Section */}
      {profile && (
        <div className="container mx-auto px-4 py-12">
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Card className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-32"></div>

              <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                  <div className="flex items-end gap-6 mb-6 md:mb-0">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
                    />
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{profile.name}</h2>
                      <p className="text-slate-600 flex items-center gap-2 mt-2">
                        <Github className="w-4 h-4" />
                        {profile.login}
                      </p>
                    </div>
                  </div>

                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      View on GitHub
                    </Button>
                  </a>
                </div>

                {profile.bio && (
                  <p className="text-slate-700 mb-6 text-lg">{profile.bio}</p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <GitFork className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm text-slate-600">Repositories</span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{profile.public_repos}</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-cyan-600" />
                      <span className="text-sm text-slate-600">Followers</span>
                    </div>
                    <p className="text-2xl font-bold text-cyan-600">{profile.followers}</p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm text-slate-600">Following</span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{profile.following}</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-cyan-600" />
                      <span className="text-sm text-slate-600">Joined</span>
                    </div>
                    <p className="text-sm font-bold text-cyan-600">{formatDate(profile.created_at)}</p>
                  </div>
                </div>

                {/* Contact Info */}
                {profile.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${profile.email}`} className="hover:text-indigo-600 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Repositories Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Recent Repositories</h2>
          <p className="text-slate-600">Explore the latest projects and contributions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, index) => (
            <div
              key={repo.name}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="backdrop-blur-md bg-white/80 border border-white/20 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full overflow-hidden group cursor-pointer">
                  {/* Accent background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-indigo-500 to-cyan-500 transition-opacity duration-300"></div>

                  <div className="relative z-10 p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex-1">
                        {repo.name}
                      </h3>
                      {repo.stargazerCount > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-700">
                            {repo.stargazerCount}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-600 mb-4 flex-1">
                      {repo.description || 'No description available'}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <span className="text-sm text-slate-500">
                        Updated {formatDate(repo.updatedAt)}
                      </span>
                      <Github className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </Card>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">GitHub Connector Dashboard</p>
          <p className="text-indigo-100">Powered by GitHub API • Built with React & Tailwind CSS</p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
