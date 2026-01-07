import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink, Filter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { useTheme } from '../../../shared/contexts/ThemeContext';
import { getPublicProject, getPublicProjectIssues } from '../../../shared/api/client';
import { SkeletonLoader } from '../../../shared/components/SkeletonLoader';

interface IssueDetailPageProps {
  issueId?: string;
  projectId?: string;
  onClose: () => void;
}

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function labelName(l: any): string {
  if (!l) return '';
  if (typeof l === 'string') return l;
  if (typeof l.name === 'string') return l.name;
  return '';
}

export function IssueDetailPage({ issueId, projectId, onClose }: IssueDetailPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<null | Awaited<ReturnType<typeof getPublicProject>>>(null);
  const [issues, setIssues] = useState<Array<{
    github_issue_id: number;
    number: number;
    state: string;
    title: string;
    description: string | null;
    author_login: string;
    labels: any[];
    url: string;
    updated_at: string | null;
    last_seen_at: string;
  }>>([]);

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(issueId || null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [p, i] = await Promise.all([getPublicProject(projectId), getPublicProjectIssues(projectId)]);
        if (cancelled) return;
        setProject(p);
        setIssues((i?.issues || []).filter((it) => it.state === 'open'));
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  // If no issue is selected, default to the first open issue.
  useEffect(() => {
    if (selectedIssueId) return;
    if (issues.length === 0) return;
    setSelectedIssueId(String(issues[0].github_issue_id));
  }, [issues, selectedIssueId]);

  const selectedIssue = useMemo(() => {
    if (!selectedIssueId) return null;
    return issues.find((i) => String(i.github_issue_id) === selectedIssueId) || null;
  }, [issues, selectedIssueId]);

  const repoName = useMemo(() => {
    const full = project?.github_full_name || '';
    const parts = full.split('/');
    return parts[1] || full || 'Project';
  }, [project?.github_full_name]);

  const projectAvatar =
    project?.repo?.owner_avatar_url ||
    (project?.repo?.owner_login ? `https://github.com/${project.repo.owner_login}.png?size=80` : 'https://github.com/github.png?size=80');

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Left Sidebar - Open Issues List */}
      <div className="w-[450px] flex-shrink-0 flex flex-col h-full space-y-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[16px] backdrop-blur-[40px] border transition-all ${
              isDark ? 'bg-white/[0.12] border-white/20 text-[#f5f5f5]' : 'bg-white/[0.35] border-black/10 text-[#2d2820]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[13px] font-semibold">Back</span>
          </button>

          <button
            className={`ml-auto relative p-3 rounded-[16px] backdrop-blur-[40px] border transition-all ${
              isDark ? 'bg-white/[0.12] border-white/20 text-[#f5f5f5]' : 'bg-white/[0.35] border-black/10 text-[#2d2820]'
            }`}
            onClick={() => {
              // Placeholder: keep button for future filtering
            }}
            title="Filters (coming soon)"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className={`backdrop-blur-[40px] rounded-[24px] border p-5 transition-colors ${
          isDark ? 'bg-white/[0.12] border-white/20' : 'bg-white/[0.12] border-white/20'
        }`}>
          <div className={`text-[16px] font-bold mb-1 ${isDark ? 'text-[#f5f5f5]' : 'text-[#2d2820]'}`}>
            Open issues
          </div>
          <div className={`text-[12px] ${isDark ? 'text-[#d4d4d4]' : 'text-[#7a6b5a]'}`}>
            {projectId ? repoName : 'Select a project'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-custom">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`p-4 rounded-[16px] backdrop-blur-[40px] border ${
                    isDark ? 'bg-white/[0.12] border-white/20' : 'bg-white/[0.12] border-white/20'
                  }`}
                >
                  <SkeletonLoader className="h-4 w-3/4 mb-2" />
                  <SkeletonLoader className="h-3 w-1/2" />
                </div>
              ))}
            </>
          ) : !projectId ? (
            <div className={`p-4 rounded-[16px] ${isDark ? 'text-[#d4d4d4]' : 'text-[#7a6b5a]'}`}>
              Pick a project to view its open issues.
            </div>
          ) : issues.length === 0 ? (
            <div className={`p-4 rounded-[16px] ${isDark ? 'text-[#d4d4d4]' : 'text-[#7a6b5a]'}`}>
              No open issues for this project.
            </div>
          ) : (
            issues.map((issue) => (
              <button
                key={issue.github_issue_id}
                onClick={() => setSelectedIssueId(String(issue.github_issue_id))}
                className={`w-full p-4 rounded-[16px] backdrop-blur-[40px] border transition-all text-left ${
                  String(issue.github_issue_id) === selectedIssueId
                    ? 'border-[#c9983a] bg-[#c9983a]/10'
                    : isDark
                      ? 'bg-white/[0.12] border-white/20 hover:bg-white/[0.15]'
                      : 'bg-white/[0.12] border-white/20 hover:bg-white/[0.15]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className={`text-[12px] font-bold mb-1 ${isDark ? 'text-[#c9983a]' : 'text-[#8b6f3a]'}`}>
                      #{issue.number}
                    </div>
                    <div className={`text-[14px] font-bold line-clamp-2 ${isDark ? 'text-[#f5f5f5]' : 'text-[#2d2820]'}`}>
                      {issue.title}
                    </div>
                    <div className={`mt-2 text-[11px] ${isDark ? 'text-[#d4d4d4]' : 'text-[#7a6b5a]'}`}>
                      {issue.author_login} • {timeAgo(issue.updated_at || issue.last_seen_at)}
                    </div>
                  </div>
                  <img
                    src={`https://github.com/${issue.author_login}.png?size=40`}
                    alt={issue.author_login}
                    className="w-6 h-6 rounded-full border border-[#c9983a]/30 flex-shrink-0 mt-0.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://github.com/github.png?size=40';
                    }}
                  />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Selected issue detail */}
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        <div className={`backdrop-blur-[40px] rounded-[24px] border p-8 transition-colors ${
          isDark ? 'bg-white/[0.12] border-white/20' : 'bg-white/[0.12] border-white/20'
        }`}>
          {isLoading ? (
            <>
              <SkeletonLoader className="h-8 w-3/4 mb-3" />
              <SkeletonLoader className="h-4 w-1/3 mb-6" />
              <SkeletonLoader className="h-4 w-full mb-2" />
              <SkeletonLoader className="h-4 w-5/6 mb-2" />
              <SkeletonLoader className="h-4 w-4/6" />
            </>
          ) : !selectedIssue ? (
            <div className={`${isDark ? 'text-[#d4d4d4]' : 'text-[#7a6b5a]'} text-[14px] font-semibold`}>
              Select an open issue to see details.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className={`text-[13px] font-semibold mb-2 ${isDark ? 'text-[#d4d4d4]' : 'text-[#7a6b5a]'}`}>
                    <span className="font-bold">{repoName}</span> • #{selectedIssue.number} • by {selectedIssue.author_login} • {timeAgo(selectedIssue.updated_at || selectedIssue.last_seen_at)}
                  </div>
                  <h1 className={`text-[26px] font-bold ${isDark ? 'text-[#f5f5f5]' : 'text-[#2d2820]'}`}>
                    {selectedIssue.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-[10px] backdrop-blur-[20px] border ${
                    isDark ? 'bg-white/[0.08] border-white/15' : 'bg-white/[0.25] border-white/30'
                  }`}>
                    <img
                      src={projectAvatar}
                      alt={repoName}
                      className="w-5 h-5 rounded-full border border-[#c9983a]/30 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://github.com/github.png?size=40';
                      }}
                    />
                    <span className={`text-[12px] font-bold ${isDark ? 'text-[#d4d4d4]' : 'text-[#4a3f2f]'}`}>
                      {repoName}
                    </span>
                  </div>

                  <button
                    onClick={() => window.open(selectedIssue.url, '_blank')}
                    className={`px-4 py-2 rounded-[12px] border transition-all inline-flex items-center gap-2 ${
                      isDark ? 'bg-white/[0.08] border-white/20 text-[#f5f5f5] hover:bg-white/[0.12]' : 'bg-white/[0.25] border-white/30 text-[#2d2820] hover:bg-white/[0.35]'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-[13px] font-semibold">GitHub</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {(Array.isArray(selectedIssue.labels) ? selectedIssue.labels : [])
                  .map((l) => labelName(l))
                  .filter(Boolean)
                  .slice(0, 12)
                  .map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-[8px] text-[12px] font-bold border transition-colors ${
                        isDark ? 'bg-white/[0.08] border-white/15 text-[#d4d4d4]' : 'bg-white/[0.25] border-white/30 text-[#4a3f2f]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                <ReactMarkdown>
                  {selectedIssue.description || '_No description provided._'}
                </ReactMarkdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


