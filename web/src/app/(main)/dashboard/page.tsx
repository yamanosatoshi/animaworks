// ---------------------------------------------------------------------------
// HiCrew Dashboard
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TaskStatus = "done" | "in_progress" | "not_started";

interface CrewMember {
  name: string;
  tag: string;
  stars: number;
  color: string;
  initial: string;
}

interface Task {
  text: string;
  status: TaskStatus;
  assignee: string;
  assigneeColor: string;
  assigneeInitial: string;
}

interface ProjectGroup {
  project: string;
  tasks: Task[];
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const crewMembers: CrewMember[] = [
  {
    name: "太郎",
    tag: "リーダー",
    stars: 5,
    color: "bg-violet-400",
    initial: "太",
  },
  {
    name: "くうら",
    tag: "営業",
    stars: 4,
    color: "bg-pink-400",
    initial: "く",
  },
  {
    name: "ケンシロウ",
    tag: "エンジニア",
    stars: 5,
    color: "bg-blue-400",
    initial: "ケ",
  },
  {
    name: "葵",
    tag: "デザイナー",
    stars: 4,
    color: "bg-emerald-400",
    initial: "葵",
  },
  {
    name: "吉田梅",
    tag: "マーケ",
    stars: 3,
    color: "bg-amber-400",
    initial: "梅",
  },
];

const taskGroups: ProjectGroup[] = [
  {
    project: "プロジェクト：Webサイトリニューアル",
    tasks: [
      {
        text: "トップページデザイン",
        status: "done",
        assignee: "太郎",
        assigneeColor: "bg-violet-400",
        assigneeInitial: "太",
      },
      {
        text: "フロントエンド開発＆各種実装確認テスト",
        status: "in_progress",
        assignee: "ケンシロウ",
        assigneeColor: "bg-blue-400",
        assigneeInitial: "ケ",
      },
      {
        text: "営業資料の見積書チェック＆スケジュール管理",
        status: "in_progress",
        assignee: "くうら",
        assigneeColor: "bg-pink-400",
        assigneeInitial: "く",
      },
    ],
  },
  {
    project: "プロジェクト：タスク管理＆メール下書き作成",
    tasks: [
      {
        text: "投稿スケジュール作成",
        status: "in_progress",
        assignee: "吉田梅",
        assigneeColor: "bg-amber-400",
        assigneeInitial: "梅",
      },
      {
        text: "クリエイティブ制作",
        status: "not_started",
        assignee: "葵",
        assigneeColor: "bg-emerald-400",
        assigneeInitial: "葵",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const statusConfig: Record<
  TaskStatus,
  { label: string; bg: string; text: string }
> = {
  done: { label: "完了", bg: "bg-emerald-100", text: "text-emerald-700" },
  in_progress: { label: "進行中", bg: "bg-violet-100", text: "text-violet-700" },
  not_started: { label: "未着手", bg: "bg-gray-100", text: "text-gray-500" },
};

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

function CheckCircle({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300" />
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl p-6">
        {/* ---- Header ---- */}
        <h1 className="mb-6 text-2xl font-bold text-gray-900">ダッシュボード</h1>

        {/* ---- Section 1: Crew Members ---- */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4">
            {crewMembers.map((member) => (
              <div
                key={member.name}
                className="flex min-w-[140px] flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center"
              >
                {/* Avatar */}
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${member.color}`}
                >
                  {member.initial}
                </div>
                {/* Name */}
                <p className="text-sm font-medium text-gray-900">
                  {member.name}
                </p>
                {/* Tag */}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {member.tag}
                </span>
                {/* Stars */}
                <Stars count={member.stars} />
              </div>
            ))}
          </div>
        </div>

        {/* ---- Section 2: Two column layout ---- */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          {/* Left column: Task status */}
          <div className="flex-[2] rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-bold text-gray-900">タスク状況</h2>

            <div className="space-y-6">
              {taskGroups.map((group) => (
                <div key={group.project}>
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    {group.project}
                  </p>
                  <div className="space-y-2">
                    {group.tasks.map((task) => (
                      <div
                        key={task.text}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5"
                      >
                        <CheckCircle checked={task.status === "done"} />
                        <span
                          className={`flex-1 text-sm ${
                            task.status === "done"
                              ? "text-gray-400 line-through"
                              : "text-gray-800"
                          }`}
                        >
                          {task.text}
                        </span>
                        <TaskStatusBadge status={task.status} />
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${task.assigneeColor}`}
                          title={task.assignee}
                        >
                          {task.assigneeInitial}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Today's team summary */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              本日のチームサマリー
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              プロジェクト「Webサイトリニューアル」は順調に進行中です。太郎がトップページデザインを完了し、ケンシロウがフロントエンド実装に着手しています。くうらは営業資料の見積書チェックとスケジュール管理を並行して進めています。
            </p>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              タスク管理＆メール下書き作成プロジェクトでは、吉田梅が投稿スケジュールの作成に取りかかっており、葵のクリエイティブ制作は来週開始予定です。
            </p>

            {/* Office image placeholder */}
            <p className="mb-2 text-xs font-medium text-gray-400">
              オフィスの様子
            </p>
            <div className="h-40 w-full rounded-xl bg-gradient-to-br from-violet-400 via-indigo-400 to-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
