<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class ProjectController extends BaseApiController
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        $query = Project::with(['client', 'members.user']);

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('client_id') && !empty($request->client_id)) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('project_code', 'like', "%{$search}%");
            });
        }

        $projects = $query->orderBy('created_at', 'desc')->get();

        return $this->jsonResponse($projects);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_code' => 'required|string|max:50|unique:projects,project_code',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:web_development,mobile_app_development,webapp_development',
            'status' => 'required|in:scoping,active_sprint,uat,maintenance,completed',
            'contract_value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'target_completion_date' => 'nullable|date|after_or_equal:start_date',
            'git_repository_url' => 'nullable|string|max:500',
            'staging_url' => 'nullable|string|max:500',
            'production_url' => 'nullable|string|max:500',
            'is_featured_case_study' => 'boolean',
            'case_study_metrics_json' => 'nullable|array',
        ]);

        $project = Project::create($validated);

        // Auto create default Sprint 1
        Sprint::create([
            'project_id' => $project->id,
            'name' => 'Sprint 1: Architecture Core & Initial Deliverables',
            'goal' => 'Setup foundation, repository pipeline, and first module deliverables.',
            'status' => 'active',
            'start_date' => $project->start_date ?? now(),
            'end_date' => $project->target_completion_date ?? now()->addWeeks(2),
            'order' => 1,
        ]);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'project.created',
            'auditable_type' => Project::class,
            'auditable_id' => $project->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => $validated,
        ]);

        return $this->jsonResponse($project->load(['client', 'sprints']), 'Proyek baru berhasil dibuat.', 201);
    }

    /**
     * Display the specified project.
     */
    public function show(string $id)
    {
        $project = Project::with(['client', 'members.user', 'sprints.tasks.assignee', 'invoices', 'tickets'])
            ->where('id', $id)
            ->orWhere('uuid', $id)
            ->first();

        if (!$project) {
            return $this->jsonError('Proyek tidak ditemukan.', 404);
        }

        return $this->jsonResponse($project);
    }

    /**
     * Get Kanban Board Hierarchy for a Project
     */
    public function board(string $uuid)
    {
        $project = Project::with(['client', 'members.user'])
            ->where('uuid', $uuid)
            ->orWhere('id', $uuid)
            ->first();

        if (!$project) {
            return $this->jsonError('Proyek tidak ditemukan.', 404);
        }

        $sprints = Sprint::where('project_id', $project->id)
            ->orderBy('order', 'asc')
            ->get();

        $tasks = Task::with('assignee')
            ->where('project_id', $project->id)
            ->orderBy('order_position', 'asc')
            ->get();

        $board = [
            'project' => $project,
            'sprints' => $sprints,
            'columns' => [
                'todo' => $tasks->where('status', 'todo')->values(),
                'in_progress' => $tasks->where('status', 'in_progress')->values(),
                'review_uat' => $tasks->where('status', 'review_uat')->values(),
                'done' => $tasks->where('status', 'done')->values(),
            ],
        ];

        return $this->jsonResponse($board);
    }

    /**
     * Update Task Status on Kanban Board
     */
    public function updateTaskStatus(Request $request, string $taskUuid)
    {
        $task = Task::where('uuid', $taskUuid)->orWhere('id', $taskUuid)->first();

        if (!$task) {
            return $this->jsonError('Task tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,review_uat,done',
            'order_position' => 'nullable|integer',
        ]);

        $task->update($validated);

        return $this->jsonResponse($task->load('assignee'), 'Status task berhasil diperbarui.');
    }

    /**
     * Add new task to Kanban Sprint
     */
    public function storeTask(Request $request, string $uuid)
    {
        $project = Project::where('uuid', $uuid)->orWhere('id', $uuid)->first();

        if (!$project) {
            return $this->jsonError('Proyek tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to_user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,review_uat,done',
            'priority' => 'required|in:low,medium,high,urgent',
            'story_points' => 'integer|min:1|max:21',
            'due_date' => 'nullable|date',
        ]);

        $validated['project_id'] = $project->id;
        $task = Task::create($validated);

        return $this->jsonResponse($task->load('assignee'), 'Task berhasil ditambahkan ke sprint.', 201);
    }

    /**
     * Update project details
     */
    public function update(Request $request, string $id)
    {
        $project = Project::where('id', $id)->orWhere('uuid', $id)->first();

        if (!$project) {
            return $this->jsonError('Proyek tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|in:web_development,mobile_app_development,webapp_development',
            'status' => 'sometimes|required|in:scoping,active_sprint,uat,maintenance,completed',
            'contract_value' => 'sometimes|required|numeric|min:0',
            'start_date' => 'nullable|date',
            'target_completion_date' => 'nullable|date',
            'git_repository_url' => 'nullable|string|max:500',
            'staging_url' => 'nullable|string|max:500',
            'production_url' => 'nullable|string|max:500',
            'is_featured_case_study' => 'boolean',
            'case_study_metrics_json' => 'nullable|array',
        ]);

        $project->update($validated);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'project.updated',
            'auditable_type' => Project::class,
            'auditable_id' => $project->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => $validated,
        ]);

        return $this->jsonResponse($project->load('client'), 'Data proyek berhasil diperbarui.');
    }
}
