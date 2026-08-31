import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Layers,
  Smartphone,
  Globe,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  X,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import { useChat } from '../contexts/ChatContext';

export const ProjectsPage = () => {
  const { projects, tasks, clients, team, addProject, addTask, updateTaskStatus } = useApi();
  const { openChatWithChannel } = useChat();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 1);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // New Project Form
  const [projectForm, setProjectForm] = useState({
    client_id: clients[0]?.id || 1,
    project_code: '',
    title: '',
    description: '',
    category: 'webapp_development',
    status: 'active_sprint',
    contract_value: 150000000,
    start_date: new Date().toISOString().split('T')[0],
    target_completion_date: '',
    git_repository_url: '',
    staging_url: '',
    production_url: '',
  });

  // New Task Form
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    story_points: 3,
    due_date: '',
    assigned_to_user_id: team[0]?.id || 1,
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId || p.uuid === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter((p) =>
    categoryFilter === 'all' ? true : p.category === categoryFilter
  );

  const projectTasks = tasks.filter(
    (t) => t.project_id === selectedProject?.id || t.project_code === selectedProject?.project_code
  );

  const columns = [
    { id: 'todo', label: 'To Do', color: 'border-zinc-700' },
    { id: 'in_progress', label: 'In Progress', color: 'border-blue-500/40' },
    { id: 'review_uat', label: 'Review & UAT', color: 'border-purple-500/40' },
    { id: 'done', label: 'Done', color: 'border-emerald-500/40' },
  ];

  const handleCreateProject = (e) => {
    e.preventDefault();
    addProject(projectForm);
    setShowProjectModal(false);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    addTask({
      ...taskForm,
      project_id: selectedProject.id,
      project_code: selectedProject.project_code,
    });
    setShowTaskModal(false);
  };

  const categoryIcons = {
    web_development: <Globe className="w-4 h-4 text-blue-400" />,
    mobile_app_development: <Smartphone className="w-4 h-4 text-purple-400" />,
    webapp_development: <Layers className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">DIGITAL PORTFOLIO COMMAND</span>
            <span className="text-xs font-mono text-zinc-400">• 3 Layanan Inti</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Proyek & Kanban Sprints
          </h1>
          <p className="text-xs text-zinc-400">
            Scrum board hierarki sprint, alokasi engineer, deliverable vault, dan integrasi repository git.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#0D0D11] hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-white/5 transition-all flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Task Sprint</span>
          </button>
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Proyek Baru</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills & Project Selector Carousel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto p-1 bg-[#0D0D11] border border-white/5 rounded-xl">
            {[
              { id: 'all', label: 'Semua Layanan' },
              { id: 'web_development', label: '1. Web Development' },
              { id: 'mobile_app_development', label: '2. Mobile App' },
              { id: 'webapp_development', label: '3. Web App (SaaS)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-zinc-400 hidden sm:block">
            {filteredProjects.length} Proyek Aktif
          </span>
        </div>

        {/* Project Selector Horizontal Strip */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredProjects.map((proj) => {
              const isSelected = proj.id === selectedProject?.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-zinc-800/90 border-white/20 shadow-md ring-1 ring-white/10'
                      : 'bg-[#0D0D11] border-white/5 hover:border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {categoryIcons[proj.category]}
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300">
                        {proj.project_code}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        proj.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : proj.status === 'active_sprint'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-white truncate w-full">{proj.title}</div>
                  <div className="flex items-center justify-between w-full text-[11px] font-mono text-zinc-400 pt-1 border-t border-white/5">
                    <span className="truncate max-w-[120px]">{proj.client?.company_name || 'B2B Client'}</span>
                    <span>Rp {(proj.contract_value / 1000000).toLocaleString('id-ID')}jt</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#0D0D11] border border-dashed border-white/10 text-center space-y-3">
            <h3 className="font-heading font-bold text-sm text-white">Belum Ada Proyek Digital</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Tambahkan proyek baru untuk menginisiasi sprint Kanban bagi tim developer.
            </p>
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-md inline-flex items-center gap-2 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Proyek Pertama</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Project Overview Bar */}
      {selectedProject && (
        <div className="p-6 rounded-2xl bg-[#0D0D11] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {selectedProject.project_code}
              </span>
              <h2 className="font-heading font-bold text-lg text-white">{selectedProject.title}</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{selectedProject.description}</p>
          </div>

          {/* Links & Channels Vault */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {selectedProject.git_repository_url && (
              <a
                href={selectedProject.git_repository_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#14141B] border border-white/10 hover:border-white/20 text-xs text-zinc-300 font-mono flex items-center gap-1.5 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
                <span>Git Repo</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            )}
            {selectedProject.staging_url && (
              <a
                href={selectedProject.staging_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#14141B] border border-white/10 hover:border-white/20 text-xs text-zinc-300 font-mono flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Staging Live</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            )}
            <button
              onClick={() => openChatWithChannel(`proj_${selectedProject.project_code}`)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
            >
              Buka Channel Chat
            </button>
          </div>
        </div>
      )}

      {/* Interactive Kanban Board (Scrum Sprints) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = projectTasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="p-4 rounded-2xl bg-[#0D0D11] border border-white/5 flex flex-col min-h-[450px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full border ${col.color} bg-white/20`}></span>
                  <span className="font-heading font-bold text-xs text-zinc-200">{col.label}</span>
                </div>
                <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-800">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List in Column */}
              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-[#14141B] border border-white/5 hover:border-white/15 transition-all space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300'
                            : task.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">{task.story_points} SP</span>
                    </div>

                    <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white leading-snug">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                        {task.description}
                      </p>
                    )}

                    {/* Footer Assignee & Move Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-zinc-400">
                      <span className="font-medium text-zinc-300">{task.assignee?.name || 'Unassigned'}</span>
                      {/* Move status buttons */}
                      <div className="flex items-center gap-1">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => {
                              const prev = col.id === 'done' ? 'review_uat' : col.id === 'review_uat' ? 'in_progress' : 'todo';
                              updateTaskStatus(task.id, prev);
                            }}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            title="Pindah Mundur"
                          >
                            ←
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => {
                              const next = col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'review_uat' : 'done';
                              updateTaskStatus(task.id, next);
                            }}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            title="Pindah Maju"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-zinc-600 text-xs font-mono">
                    Kosong
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-heading font-bold text-base text-white">Buat Proyek Digital Baru</h3>
              <button onClick={() => setShowProjectModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Klien B2B *</label>
                  <select
                    value={projectForm.client_id}
                    onChange={(e) => setProjectForm({ ...projectForm, client_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Kode Proyek *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.project_code}
                    onChange={(e) => setProjectForm({ ...projectForm, project_code: e.target.value })}
                    placeholder="INTL-2026-015"
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Judul Proyek *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Enterprise Core WebApp"
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Kategori Layanan *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  >
                    <option value="web_development">1. Web Development</option>
                    <option value="mobile_app_development">2. Mobile App Development</option>
                    <option value="webapp_development">3. Web App Development</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Nilai Kontrak (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={projectForm.contract_value}
                    onChange={(e) => setProjectForm({ ...projectForm, contract_value: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Deskripsi Proyek</label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Git Repository URL</label>
                  <input
                    type="text"
                    value={projectForm.git_repository_url}
                    onChange={(e) => setProjectForm({ ...projectForm, git_repository_url: e.target.value })}
                    placeholder="https://github.com/intelecta-org/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Staging Live URL</label>
                  <input
                    type="text"
                    value={projectForm.staging_url}
                    onChange={(e) => setProjectForm({ ...projectForm, staging_url: e.target.value })}
                    placeholder="https://staging-...intelecta.dev"
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl hover:bg-white/5 text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold"
                >
                  Simpan & Buat Sprint 1
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-heading font-bold text-base text-white">Tambah Task ke Sprint</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Judul Task *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Implementasi endpoint autentikasi..."
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Deskripsi Teknis</label>
                <textarea
                  rows={2}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Prioritas</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Story Points</label>
                  <input
                    type="number"
                    value={taskForm.story_points}
                    onChange={(e) => setTaskForm({ ...taskForm, story_points: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Assign Engineer</label>
                <select
                  value={taskForm.assigned_to_user_id}
                  onChange={(e) => setTaskForm({ ...taskForm, assigned_to_user_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#14141B] border border-white/10 text-zinc-100 outline-none"
                >
                  {team.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.team_profile?.job_title || 'Engineer'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl hover:bg-white/5 text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold"
                >
                  Tambahkan ke Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
