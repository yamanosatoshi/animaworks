// ---------------------------------------------------------------------------
// HiCrew Dashboard — pixel-perfect to design (hicrew_dashboard.png)
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
  /** 7×4 activity grid — true = active day */
  activity: boolean[][];
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
  accentColor: string;
  tasks: Task[];
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

/** Generate a random 7×4 activity grid */
function makeActivity(): boolean[][] {
  return Array.from({ length: 4 }, () =>
    Array.from({ length: 7 }, () => Math.random() > 0.4),
  );
}

const crewMembers: CrewMember[] = [
  {
    name: "太郎",
    tag: "リーダー",
    stars: 5,
    color: "bg-violet-400",
    initial: "太",
    activity: makeActivity(),
  },
  {
    name: "さくら",
    tag: "営業",
    stars: 4,
    color: "bg-pink-400",
    initial: "さ",
    activity: makeActivity(),
  },
  {
    name: "ケンシロウ",
    tag: "エンジニア",
    stars: 5,
    color: "bg-blue-400",
    initial: "ケ",
    activity: makeActivity(),
  },
  {
    name: "葵",
    tag: "デザイナー",
    stars: 4,
    color: "bg-emerald-400",
    initial: "葵",
    activity: makeActivity(),
  },
  {
    name: "吉田梅",
    tag: "マーケ",
    stars: 3,
    color: "bg-amber-400",
    initial: "梅",
    activity: makeActivity(),
  },
];

const taskGroups: ProjectGroup[] = [
  {
    project: "プロジェクト：全体スケジュールの確認",
    accentColor: "border-violet-500",
    tasks: [
      {
        text: "トップページデザイン",
        status: "done",
        assignee: "太郎",
        assigneeColor: "bg-violet-400",
        assigneeInitial: "太",
      },
      {
        text: "WEBサイト大幅変更＆状況確認テスト",
        status: "in_progress",
        assignee: "ケンシロウ",
        assigneeColor: "bg-blue-400",
        assigneeInitial: "ケ",
      },
      {
        text: "営業資料の見積書チェック＆スケジュール管理",
        status: "in_progress",
        assignee: "さくら",
        assigneeColor: "bg-pink-400",
        assigneeInitial: "さ",
      },
    ],
  },
  {
    project: "プロジェクト：タスク管理＆メール下書き作成",
    accentColor: "border-pink-500",
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
          className={`h-3 w-3 ${i < count ? "text-yellow-400" : "text-gray-200"}`}
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

/** 7×4 heatmap-style activity grid */
function ActivityGrid({ grid }: { grid: boolean[][] }) {
  return (
    <div className="mt-1.5 flex flex-col gap-[3px]">
      {grid.map((row, ri) => (
        <div key={ri} className="flex gap-[3px] justify-center">
          {row.map((active, ci) => (
            <span
              key={ci}
              className={[
                "h-[6px] w-[6px] rounded-[1px]",
                active ? "bg-emerald-400" : "bg-gray-200",
              ].join(" ")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const statusConfig: Record<TaskStatus, { label: string; bg: string; text: string }> = {
  done: { label: "完了", bg: "bg-emerald-100", text: "text-emerald-700" },
  in_progress: { label: "進行中", bg: "bg-violet-100", text: "text-violet-700" },
  not_started: { label: "未着手", bg: "bg-gray-100", text: "text-gray-500" },
};

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${cfg.bg} ${cfg.text}`}
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-5">
        {/* ---- Header ---- */}
        <h1 className="mb-5 text-xl font-bold text-text-primary">ダッシュボード</h1>

        {/* ---- Section 1: Crew Members — horizontal scroll ---- */}
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-3">
            {crewMembers.map((member) => (
              <div
                key={member.name}
                className="flex min-w-[130px] max-w-[140px] flex-col items-center gap-1.5 rounded-xl border border-border-default bg-card-bg px-3 py-3 text-center shadow-sm"
              >
                {/* Avatar */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white ${member.color}`}
                >
                  {member.initial}
                </div>
                {/* Name */}
                <p className="text-xs font-semibold text-text-primary">{member.name}</p>
                {/* Tag */}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-text-muted">
                  {member.tag}
                </span>
                {/* Stars */}
                <Stars count={member.stars} />
                {/* Activity grid */}
                <ActivityGrid grid={member.activity} />
              </div>
            ))}
          </div>
        </div>

        {/* ---- Section 2: Two-column layout ---- */}
        <div className="mt-6 flex flex-col gap-5 lg:flex-row">
          {/* Left — Task status */}
          <div className="flex-[2] rounded-xl border border-border-default bg-card-bg p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-text-primary">タスク状況</h2>

            <div className="space-y-5">
              {taskGroups.map((group) => (
                <div key={group.project} className={`border-l-[3px] ${group.accentColor} pl-4`}>
                  <p className="mb-2 text-sm font-medium text-text-muted">
                    {group.project}
                  </p>
                  <div className="space-y-2">
                    {group.tasks.map((task) => (
                      <div
                        key={task.text}
                        className="flex items-center gap-3 rounded-lg border border-border-default px-3 py-2.5 bg-white"
                      >
                        <CheckCircle checked={task.status === "done"} />
                        <span
                          className={`flex-1 text-sm ${
                            task.status === "done"
                              ? "text-text-disabled line-through"
                              : "text-text-primary"
                          }`}
                        >
                          {task.text}
                        </span>
                        <TaskStatusBadge status={task.status} />
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${task.assigneeColor}`}
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

          {/* Right — Team summary */}
          <div className="flex-1 flex flex-col gap-4 rounded-xl border border-border-default bg-card-bg p-5 shadow-sm">
            <h2 className="text-base font-bold text-text-primary">本日のチームサマリー</h2>

            <p className="text-sm leading-relaxed text-text-secondary">
              プロジェクト「Webサイトリニューアル」は順調に進行中です。太郎がトップページデザインを完了し、ケンシロウがフロントエンド実装に着手しています。さくらは営業資料の見積書チェックとスケジュール管理を並行して進めています。
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              タスク管理＆メール下書き作成プロジェクトでは、吉田梅が投稿スケジュールの作成に取りかかっており、葵のクリエイティブ制作は来週開始予定です。
            </p>

            <div className="mt-auto">
              <p className="mb-2 text-xs font-medium text-text-muted">オフィスの様子</p>
              <div className="h-36 w-full overflow-hidden rounded-xl bg-gradient-to-br from-violet-400 via-indigo-400 to-blue-400">
                {/* Placeholder illustration */}
                <div className="flex h-full items-center justify-center text-white/60 text-sm">
                  🏢 オフィスイラスト
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-sidebar-bg px-5 py-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-sm text-white/90">
            プロジェクト・タスク確認＆メール下書き作成
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-white/50">進捗 60%</span>
            <div className="h-1.5 w-24 rounded-full bg-white/20">
              <div className="h-1.5 w-[60%] rounded-full bg-accent-light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
