'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Layers,
  Smartphone,
  Globe,
  GitBranch,
  ExternalLink,
  X,
} from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import { useChat } from '../contexts/ChatContext';

export const ProjectsPage = () => {
  const { projects, tasks, clients, team, addProject, addTask, updateTaskStatus } = useApi();
  const { openChatWithChannel } = useChat();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // New Project Form
  const [projectForm, setProjectForm] = useState({
    client_id: clients[0]?.id || '',
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
    assigned_to_user_id: team[0]?.id || '',
  });

  const activeProjectsList = projects || [];
  const selectedProject = activeProjectsList.find((p) => p.id === selectedProjectId) || activeProjectsList[0] || null;

  const filteredProjects = activeProjectsList.filter((p) =>
    categoryFilter === 'all' ? true : p.category === categoryFilter
  );

  const projectTasks = (tasks || []).filter(
    (t) => t.project_id === selectedProject?.id || t.project_code === selectedProject?.project_code
  );

  const columns = [
    { id: 'todo', label: 'To Do', border: 'border-coal-600' },
    { id: 'in_progress', label: 'In Progress', border: 'border-lightgray-400' },
    { id: 'review_uat', label: 'Review & UAT', border: 'border-lightgray-300' },
    { id: 'done', label: 'Done', border: 'border-lightgray-100' },
  ];

  const handleCreateProject = async (e) => {
    e.preventDefault();
    await addProject(projectForm);
    setShowProjectModal(false);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    await addTask({
      ...taskForm,
      project_id: selectedProject.id,
      project_code: selectedProject.project_code,
    });
    setShowTaskModal(false);
  };

  const categoryIcons = {
    web_development: <Globe className="w-4 h-4 text-lightgray-200" />,
    mobile_app_development: <Smartphone className="w-4 h-4 text-lightgray-200" />,
    webapp_development: <Layers className="w-4 h-4 text-lightgray-200" />,
  };

  return (
    <div className="p-6 space-y-6 text-lightgray-100 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-700 pb-5">
        <div>
          <h1 className="font-heading font-bold text-xl text-lightgray-100 tracking-tight">
            Proyek & Kanban Sprints
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            Scrum board sprint, alokasi engineer, deliverable vault, dan integrasi repository git.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-3 py-1.5 bg-coal-850 hover:bg-coal-800 text-lightgray-200 text-xs font-medium border border-coal-700 hover:border-coal-500 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Task</span>
          </button>
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-3 py-1.5 bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Proyek</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills & Project Selector Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-coal-900 border border-coal-700">
            {[
              { id: 'all', label: 'Semua Kategori' },
              { id: 'web_development', label: 'Web Dev' },
              { id: 'mobile_app_development', label: 'Mobile App' },
              { id: 'webapp_development', label: 'Web App (SaaS)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-coal-800 text-lightgray-100 border border-coal-600'
                    : 'text-coal-400 hover:text-lightgray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-coal-400 hidden sm:block">
            {filteredProjects.length} Proyek Terdaftar
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
                  className={`p-4 rounded-none border text-left transition-colors flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-coal-800 border-coal-500 shadow-sm'
                      : 'bg-coal-850 border-coal-700 hover:border-coal-600 text-coal-300 hover:text-lightgray-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {categoryIcons[proj.category]}
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-none bg-coal-900 border border-coal-700 text-lightgray-300">
                        {proj.project_code || 'PRJ'}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-none uppercase font-semibold bg-coal-800 border border-coal-600 text-lightgray-300">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-lightgray-100 truncate w-full">{proj.title}</div>
                  <div className="flex items-center justify-between w-full text-[11px] font-mono text-coal-400 pt-1.5 border-t border-coal-800">
                    <span className="truncate max-w-[120px]">{proj.client?.company_name || 'B2B Client'}</span>
                    <span>Rp {(Number(proj.contract_value || 0) / 1000000).toLocaleString('id-ID')}jt</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-none bg-coal-850 border border-dashed border-coal-700 text-center space-y-3">
            <h3 className="font-heading font-bold text-sm text-lightgray-100">Belum Ada Proyek Digital</h3>
            <p className="text-xs text-coal-400 max-w-sm mx-auto">
              Tambahkan proyek baru untuk menginisiasi sprint Kanban bagi tim developer.
            </p>
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-4 py-2 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 text-xs font-semibold shadow-sm inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Proyek Pertama</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Project Overview Bar */}
      {selectedProject && (
        <div className="p-6 rounded-none bg-coal-850 border border-coal-700 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300">
                {selectedProject.project_code || 'PRJ'}
              </span>
              <h2 className="font-heading font-bold text-lg text-lightgray-100">{selectedProject.title}</h2>
            </div>
            <p className="text-xs text-coal-400 leading-relaxed">{selectedProject.description}</p>
          </div>

          {/* Links & Channels Vault */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {selectedProject.git_repository_url && (
              <a
                href={selectedProject.git_repository_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-none bg-coal-900 border border-coal-700 hover:border-coal-500 text-xs text-lightgray-200 font-mono flex items-center gap-1.5 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-coal-400" />
                <span>Git Repo</span>
                <ExternalLink className="w-3 h-3 text-coal-400" />
              </a>
            )}
            {selectedProject.staging_url && (
              <a
                href={selectedProject.staging_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-none bg-coal-900 border border-coal-700 hover:border-coal-500 text-xs text-lightgray-200 font-mono flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-lightgray-300" />
                <span>Staging Live</span>
                <ExternalLink className="w-3 h-3 text-coal-400" />
              </a>
            )}
            <button
              onClick={() => openChatWithChannel('general')}
              className="px-3.5 py-1.5 rounded-none bg-coal-800 hover:bg-coal-700 border border-coal-600 text-lightgray-100 text-xs font-semibold transition-colors"
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
            <div key={col.id} className="p-4 rounded-none bg-coal-850 border border-coal-700 flex flex-col min-h-[450px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-coal-700">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-none border ${col.border} bg-lightgray-300`}></span>
                  <span className="font-heading font-bold text-xs text-lightgray-200 uppercase tracking-wider">{col.label}</span>
                </div>
                <span className="text-xs font-mono text-coal-400 px-2 py-0.5 rounded-none bg-coal-900 border border-coal-700">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List in Column */}
              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-none bg-coal-900 border border-coal-700 hover:border-coal-500 transition-colors space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-none uppercase font-semibold bg-coal-800 border border-coal-600 text-lightgray-300">
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-mono text-coal-400">{task.story_points || 3} SP</span>
                    </div>

                    <h4 className="text-xs font-semibold text-lightgray-200 group-hover:text-white leading-snug">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[11px] text-coal-400 line-clamp-2 leading-relaxed font-sans">
                        {task.description}
                      </p>
                    )}

                    {/* Footer Assignee & Move Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-coal-800 text-[10px] text-coal-400">
                      <span className="font-medium text-lightgray-300">{task.assignee?.name || 'Assigned'}</span>
                      {/* Move status buttons */}
                      <div className="flex items-center gap-1">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => {
                              const prev = col.id === 'done' ? 'review_uat' : col.id === 'review_uat' ? 'in_progress' : 'todo';
                              updateTaskStatus(task.id, prev);
                            }}
                            className="p-1 rounded-none bg-coal-800 hover:bg-coal-700 text-lightgray-200 border border-coal-600"
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
                            className="p-1 rounded-none bg-coal-800 hover:bg-coal-700 text-lightgray-200 border border-coal-600"
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
                  <div className="h-32 border border-dashed border-coal-700 rounded-none flex items-center justify-center text-coal-500 text-xs font-mono">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-coal-900 border border-coal-600 rounded-none shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-coal-700 pb-3">
              <h3 className="font-heading font-bold text-base text-lightgray-100">Buat Proyek Digital Baru</h3>
              <button onClick={() => setShowProjectModal(false)} className="text-coal-400 hover:text-lightgray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Klien B2B *</label>
                  <select
                    value={projectForm.client_id}
                    onChange={(e) => setProjectForm({ ...projectForm, client_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  >
                    {(clients || []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Kode Proyek *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.project_code}
                    onChange={(e) => setProjectForm({ ...projectForm, project_code: e.target.value })}
                    placeholder="INTL-2026-015"
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Judul Proyek *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Enterprise Core WebApp"
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Kategori Layanan *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  >
                    <option value="web_development">1. Web Development</option>
                    <option value="mobile_app_development">2. Mobile App Development</option>
                    <option value="webapp_development">3. Web App Development</option>
                  </select>
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Nilai Kontrak (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={projectForm.contract_value}
                    onChange={(e) => setProjectForm({ ...projectForm, contract_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Deskripsi Proyek</label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Git Repository URL</label>
                  <input
                    type="text"
                    value={projectForm.git_repository_url}
                    onChange={(e) => setProjectForm({ ...projectForm, git_repository_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Staging Live URL</label>
                  <input
                    type="text"
                    value={projectForm.staging_url}
                    onChange={(e) => setProjectForm({ ...projectForm, staging_url: e.target.value })}
                    placeholder="https://staging...."
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-coal-700">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-none hover:bg-coal-800 text-coal-400 hover:text-lightgray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 font-semibold"
                >
                  Simpan & Buat Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-coal-900 border border-coal-600 rounded-none shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-coal-700 pb-3">
              <h3 className="font-heading font-bold text-base text-lightgray-100">Tambah Task ke Sprint</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-coal-400 hover:text-lightgray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="text-coal-400 block mb-1">Judul Task *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Implementasi endpoint autentikasi..."
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                />
              </div>

              <div>
                <label className="text-coal-400 block mb-1">Deskripsi Teknis</label>
                <textarea
                  rows={2}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-coal-400 block mb-1">Prioritas</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-coal-400 block mb-1">Story Points</label>
                  <input
                    type="number"
                    value={taskForm.story_points}
                    onChange={(e) => setTaskForm({ ...taskForm, story_points: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-none bg-coal-850 border border-coal-700 text-lightgray-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-coal-700">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-none hover:bg-coal-800 text-coal-400 hover:text-lightgray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 font-semibold"
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
