// ---------------------------------------------------------------------------
// HiCrew Dashboard — pixel-perfect to design (hicrew_dashboard.png)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TaskStatus = "done" | "in_progress" | "not_started";

interface CrewMember {
  name: string;
  role: string;
  tag: string;
  level: string;
  color: string;
  initial: string;
  skills: {
    tsk: number;
    esp: number;
    mp: number;
  };
  taskTitle: string;
  taskSubText?: string;
  progress?: number;
  waitingText?: string;
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
// Sample data
// ---------------------------------------------------------------------------

const crewMembers: CrewMember[] = [
  {
    name: "太郎",
    role: "プロジェクト全体統括・意思決定支援",
    tag: "リーダー",
    level: "Lv.12",
    color: "bg-violet-400",
    initial: "太",
    skills: { tsk: 4, esp: 3, mp: 3 },
    taskTitle: "★ Notion「2024年プロジェクト管理」に書き出し",
    taskSubText: "留意: に書き出し中 ●●●",
    progress: 80,
  },
  {
    name: "さくら",
    role: "競合調査・トレンド分析・資料集約",
    tag: "プロジェクトマネージャー",
    level: "Lv.10",
    color: "bg-pink-400",
    initial: "さ",
    skills: { tsk: 2, esp: 2, mp: 2 },
    taskTitle: "メール下書き生成中・・・",
    taskSubText: "AI送信前に承認が必要です",
    progress: 80,
  },
  {
    name: "ケンシロウ",
    role: "競合調査・トレンド分析・資料集約",
    tag: "カスタマーサクセス",
    level: "Lv.8",
    color: "bg-blue-400",
    initial: "ケ",
    skills: { tsk: 2, esp: 2, mp: 2 },
    taskTitle: "メール下書き生成中・・・",
    taskSubText: "AI送信前に承認が必要です",
    progress: 80,
  },
  {
    name: "葵",
    role: "競合調査・トレンド分析・資料集約",
    tag: "マーケター / リサーチ",
    level: "Lv.8",
    color: "bg-emerald-400",
    initial: "葵",
    skills: { tsk: 2, esp: 2, mp: 2 },
    taskTitle: "音声データのテキスト解析",
    taskSubText: "指示待ち",
    progress: 0,
  },
  {
    name: "吉田梅",
    role: "競合調査・トレンド分析・資料集約",
    tag: "営業アシスタント",
    level: "Lv.5",
    color: "bg-amber-400",
    initial: "梅",
    skills: { tsk: 1, esp: 0, mp: 0 },
    taskTitle: "待機中...",
    waitingText: "次のタスクが割り当てられるのを待機中",
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

function SkillStars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3 w-3 ${i < count ? "text-violet-400" : "text-gray-300"}`}
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
                className="flex min-w-[220px] max-w-[240px] flex-col rounded-xl border border-border-default bg-card-bg p-3 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${member.color}`}
                  >
                    {member.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] text-text-muted">
                          {member.tag}
                        </span>
                        <p className="mt-1 text-xl font-semibold leading-none text-text-primary">{member.name}</p>
                      </div>
                      <span className="rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {member.level}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[10px] text-text-muted">{member.role}</p>

                <div className="mt-2 space-y-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-text-secondary">TSK</span>
                    <SkillStars count={member.skills.tsk} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-text-secondary">ESP</span>
                    <SkillStars count={member.skills.esp} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-text-secondary">MP</span>
                    <SkillStars count={member.skills.mp} />
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-gray-50 px-2.5 py-2">
                  <p className="text-[11px] text-text-secondary">{member.taskTitle}</p>
                  {member.taskSubText && (
                    <p className="mt-1 text-[11px] text-pink-500">{member.taskSubText}</p>
                  )}
                  {typeof member.progress === "number" ? (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-lime-400" style={{ width: `${member.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-text-muted">{member.progress}%</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-[10px] text-gray-400">{member.waitingText}</p>
                  )}
                </div>
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
              <div className="relative h-36 w-full overflow-hidden rounded-xl bg-gradient-to-br from-violet-400 via-indigo-400 to-blue-400">
                {/* Isometric office illustration */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  {/* Floor */}
                  <rect x="0" y="110" width="400" height="50" fill="white" fillOpacity="0.08" />
                  {/* Desk 1 */}
                  <rect x="30" y="80" width="70" height="8" rx="2" fill="white" fillOpacity="0.25" />
                  <rect x="40" y="88" width="6" height="22" fill="white" fillOpacity="0.15" />
                  <rect x="84" y="88" width="6" height="22" fill="white" fillOpacity="0.15" />
                  {/* Monitor 1 */}
                  <rect x="45" y="56" width="34" height="24" rx="2" fill="white" fillOpacity="0.35" />
                  <rect x="48" y="59" width="28" height="17" rx="1" fill="white" fillOpacity="0.15" />
                  <rect x="59" y="80" width="6" height="3" fill="white" fillOpacity="0.2" />
                  {/* Person 1 */}
                  <circle cx="55" cy="68" r="0" fill="white" fillOpacity="0" />
                  <circle cx="25" cy="72" r="7" fill="white" fillOpacity="0.3" />
                  <rect x="20" y="79" width="10" height="18" rx="3" fill="white" fillOpacity="0.2" />
                  {/* Desk 2 */}
                  <rect x="160" y="75" width="80" height="8" rx="2" fill="white" fillOpacity="0.25" />
                  <rect x="170" y="83" width="6" height="27" fill="white" fillOpacity="0.15" />
                  <rect x="224" y="83" width="6" height="27" fill="white" fillOpacity="0.15" />
                  {/* Monitor 2 */}
                  <rect x="178" y="48" width="38" height="27" rx="2" fill="white" fillOpacity="0.35" />
                  <rect x="181" y="51" width="32" height="20" rx="1" fill="white" fillOpacity="0.15" />
                  <rect x="194" y="75" width="6" height="3" fill="white" fillOpacity="0.2" />
                  {/* Person 2 */}
                  <circle cx="155" cy="66" r="8" fill="white" fillOpacity="0.3" />
                  <rect x="149" y="74" width="12" height="20" rx="3" fill="white" fillOpacity="0.2" />
                  {/* Desk 3 */}
                  <rect x="290" y="82" width="75" height="8" rx="2" fill="white" fillOpacity="0.25" />
                  <rect x="300" y="90" width="6" height="20" fill="white" fillOpacity="0.15" />
                  <rect x="349" y="90" width="6" height="20" fill="white" fillOpacity="0.15" />
                  {/* Monitor 3 */}
                  <rect x="308" y="58" width="32" height="24" rx="2" fill="white" fillOpacity="0.35" />
                  <rect x="311" y="61" width="26" height="17" rx="1" fill="white" fillOpacity="0.15" />
                  <rect x="321" y="82" width="6" height="3" fill="white" fillOpacity="0.2" />
                  {/* Person 3 */}
                  <circle cx="285" cy="74" r="7" fill="white" fillOpacity="0.3" />
                  <rect x="280" y="81" width="10" height="16" rx="3" fill="white" fillOpacity="0.2" />
                  {/* Plant */}
                  <rect x="130" y="90" width="6" height="20" fill="white" fillOpacity="0.15" />
                  <ellipse cx="133" cy="84" rx="12" ry="10" fill="white" fillOpacity="0.18" />
                  <ellipse cx="128" cy="78" rx="8" ry="7" fill="white" fillOpacity="0.12" />
                  {/* Bookshelf */}
                  <rect x="370" y="30" width="20" height="80" rx="2" fill="white" fillOpacity="0.12" />
                  <rect x="372" y="38" width="16" height="4" fill="white" fillOpacity="0.08" />
                  <rect x="372" y="52" width="16" height="4" fill="white" fillOpacity="0.08" />
                  <rect x="372" y="66" width="16" height="4" fill="white" fillOpacity="0.08" />
                  {/* Window */}
                  <rect x="240" y="20" width="30" height="40" rx="2" fill="white" fillOpacity="0.1" />
                  <line x1="255" y1="20" x2="255" y2="60" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
                  <line x1="240" y1="40" x2="270" y2="40" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-3">
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
