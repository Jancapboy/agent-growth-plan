// src/data/requirements/index.ts - 需求卡片库

import { RequirementTemplate } from '@/types/requirement';

export const requirementTemplates: RequirementTemplate[] = [
  {
    id: 'emotion_aware',
    title: '让 Agent 更有人情味',
    description: '咱们 Agent 现在回答太机械了，要更有人情味。最好像真人客服那样，能感知用户情绪，然后调整语气。这个应该不难吧？我看 OpenAI 的 demo 挺简单的。',
    urgency: 'medium',
    minSprint: 3,
    weight: 8,
    steps: [
      {
        name: '明确"人情味"的量化指标',
        description: 'PM 说"人情味"，但我们需要可量化的指标',
        options: [
          { id: 'emotion_acc', label: '情绪识别准确率', description: '使用分类模型判断用户情绪，准确率目标 85%', qualityContribution: 15, costMultiplier: 1, techDebtDelta: 0 },
          { id: 'diversity', label: '回答多样性 (perplexity)', description: '用 perplexity 衡量回答多样性，降低重复感', qualityContribution: 5, costMultiplier: 1, techDebtDelta: 0 },
          { id: 'user_score', label: '用户情感评分', description: '直接让用户给回答打情感分，最贴近业务目标', qualityContribution: 20, costMultiplier: 1.2, techDebtDelta: 0 },
        ],
      },
      {
        name: '技术方案设计',
        description: '选择实现"人情味"的技术路径',
        options: [
          { id: 'finetune', label: '微调 LLM', description: '收集情感对话数据，微调基础模型。成本高，效果最好', qualityContribution: 25, costMultiplier: 2, techDebtDelta: 5 },
          { id: 'prompt', label: 'Prompt Engineering', description: '在 system prompt 中加入情感指令。成本低，效果中等', qualityContribution: 10, costMultiplier: 0.8, techDebtDelta: -2 },
          { id: 'emotion_model', label: '外挂情绪识别模型', description: '先识别情绪，再拼接对应风格的 prompt。中等成本，可能增加延迟', qualityContribution: 15, costMultiplier: 1.2, techDebtDelta: 3 },
        ],
      },
      {
        name: '评估指标定义',
        description: '定义可量化的成功标准',
        options: [
          { id: 'full_metrics', label: '完整指标体系', description: '准确率 + 用户满意度 + 多样性 + 延迟。全面但复杂', qualityContribution: 15, costMultiplier: 1.5, techDebtDelta: 0 },
          { id: 'simple_metric', label: '单一核心指标', description: '只追踪用户满意度。简单但可能遗漏问题', qualityContribution: 5, costMultiplier: 0.8, techDebtDelta: 0 },
          { id: 'no_metric', label: '不定义指标', description: '上线后看反馈。风险高', qualityContribution: -20, costMultiplier: 0.5, techDebtDelta: 10 },
        ],
      },
    ],
  },
  {
    id: 'multi_agent',
    title: '支持多 Agent 协作',
    description: '客户要求我们的 Agent 能和其他 Agent 协作，比如一个负责查询、一个负责总结、一个负责校验。这个架构升级很重要，竞争对手都有了。',
    urgency: 'high',
    minSprint: 5,
    weight: 7,
    steps: [
      {
        name: '定义协作模式',
        description: '多 Agent 之间如何协作？',
        options: [
          { id: 'hierarchical', label: '层级式', description: '一个主 Agent 调度多个子 Agent。简单但主 Agent 是瓶颈', qualityContribution: 10, costMultiplier: 1, techDebtDelta: 3 },
          { id: 'mesh', label: '网状式', description: '所有 Agent 平等通信。灵活但复杂度高', qualityContribution: 20, costMultiplier: 1.8, techDebtDelta: 8 },
          { id: 'pipeline', label: '流水线式', description: 'Agent 按固定顺序处理。简单但不够灵活', qualityContribution: 5, costMultiplier: 0.8, techDebtDelta: 0 },
        ],
      },
      {
        name: '通信协议选择',
        description: 'Agent 之间如何交换信息？',
        options: [
          { id: 'mcp', label: 'MCP 协议', description: '标准化协议，生态好。但刚推出，成熟度存疑', qualityContribution: 15, costMultiplier: 1.2, techDebtDelta: 2 },
          { id: 'custom', label: '自研协议', description: '完全可控。但维护成本高，和外部集成困难', qualityContribution: 5, costMultiplier: 1.5, techDebtDelta: 10 },
          { id: 'message_queue', label: '消息队列', description: '用 Redis/RabbitMQ 做异步通信。成熟但增加了延迟', qualityContribution: 10, costMultiplier: 1, techDebtDelta: 4 },
        ],
      },
    ],
  },
  {
    id: 'self_healing',
    title: 'Agent 自我修复能力',
    description: '能不能让 Agent 自己发现自己的错误并修复？比如代码写错了，Agent 自己跑测试，发现失败了就改。这样能大大减少人工干预。',
    urgency: 'low',
    minSprint: 8,
    weight: 5,
    steps: [
      {
        name: '定义修复范围',
        description: 'Agent 能修什么？',
        options: [
          { id: 'code_only', label: '仅代码', description: 'Agent 只修复自己生成的代码。范围明确，可行', qualityContribution: 15, costMultiplier: 1, techDebtDelta: 2 },
          { id: 'config', label: '代码+配置', description: '代码和配置都自动修复。范围扩大，风险增加', qualityContribution: 20, costMultiplier: 1.3, techDebtDelta: 5 },
          { id: 'everything', label: '全自动化', description: '包括架构调整、数据库迁移等。过于激进，风险极高', qualityContribution: 10, costMultiplier: 2, techDebtDelta: 15 },
        ],
      },
      {
        name: '安全机制设计',
        description: '自动修复如何保证安全？',
        options: [
          { id: 'sandbox', label: '沙箱环境', description: '所有修复先在沙箱验证，通过后才生效。安全但慢', qualityContribution: 15, costMultiplier: 1.3, techDebtDelta: 3 },
          { id: 'human_approval', label: '人工审批', description: 'Agent 提出修复方案，人工确认后执行。安全但失去自动化意义', qualityContribution: 10, costMultiplier: 1, techDebtDelta: 0 },
          { id: 'no_safety', label: '无安全机制', description: '直接部署。最快但最危险', qualityContribution: -15, costMultiplier: 0.5, techDebtDelta: 20 },
        ],
      },
    ],
  },
  {
    id: 'mobile_app',
    title: '推出移动端 App',
    description: '用户反馈说网页版不方便，希望能有 App。iOS 和 Android 都要，最好还能离线使用。这个能大幅提升用户粘性。',
    urgency: 'medium',
    minSprint: 6,
    weight: 6,
    steps: [
      {
        name: '技术方案选择',
        description: '移动端怎么实现？',
        options: [
          { id: 'native', label: '原生开发', description: 'iOS Swift + Android Kotlin。体验最好，但团队需要新技能', qualityContribution: 20, costMultiplier: 2, techDebtDelta: 5 },
          { id: 'flutter', label: 'Flutter', description: '一套代码双端运行。开发快，但包体积大', qualityContribution: 15, costMultiplier: 1.2, techDebtDelta: 3 },
          { id: 'pwa', label: 'PWA 网页套壳', description: '最快上线，但体验差。用户可能不满意', qualityContribution: 5, costMultiplier: 0.6, techDebtDelta: -2 },
        ],
      },
      {
        name: '离线策略',
        description: '离线时 Agent 还能工作吗？',
        options: [
          { id: 'local_llm', label: '本地小模型', description: '端侧运行 3B 模型，能处理简单任务。效果好但包体积大', qualityContribution: 15, costMultiplier: 1.5, techDebtDelta: 8 },
          { id: 'cache', label: '缓存历史对话', description: '只能查看历史，不能新对话。简单但体验差', qualityContribution: 5, costMultiplier: 0.8, techDebtDelta: 0 },
          { id: 'no_offline', label: '不支持离线', description: '联网才能用。简单实现，用户可能流失', qualityContribution: -5, costMultiplier: 0.5, techDebtDelta: -1 },
        ],
      },
    ],
  },
  {
    id: 'cost_optimize',
    title: '降低 LLM 调用成本',
    description: '最近账单涨得太快了，客户开始抱怨。能不能优化一下成本？比如缓存、模型降级、量化这些手段。',
    urgency: 'high',
    minSprint: 4,
    weight: 9,
    steps: [
      {
        name: '优化策略选择',
        description: '从哪入手降低成本？',
        options: [
          { id: 'cache', label: '响应缓存', description: '相同查询直接返回缓存结果。简单有效，但可能返回过时信息', qualityContribution: 10, costMultiplier: 0.8, techDebtDelta: 2 },
          { id: 'model_fallback', label: '模型降级', description: '简单任务用小模型，复杂任务才用大模型。节省但可能质量下降', qualityContribution: 15, costMultiplier: 1, techDebtDelta: 3 },
          { id: 'quantization', label: '模型量化', description: 'INT4/INT8 量化减少显存和推理成本。可能影响精度', qualityContribution: 5, costMultiplier: 1.5, techDebtDelta: 8 },
        ],
      },
      {
        name: '用户体验影响',
        description: '成本优化会影响用户体验吗？',
        options: [
          { id: 'transparent', label: '透明降级', description: '用户无感知，系统自动选择最优方案。最理想但实现复杂', qualityContribution: 20, costMultiplier: 1.3, techDebtDelta: 5 },
          { id: 'notify', label: '主动告知', description: '告诉用户"正在使用轻量模式"。诚实但可能让用户觉得产品低端', qualityContribution: 10, costMultiplier: 1, techDebtDelta: 0 },
          { id: 'silent', label: '静默降级', description: '用户不知道，但质量确实下降了。可能引发投诉', qualityContribution: -10, costMultiplier: 0.7, techDebtDelta: 5 },
        ],
      },
    ],
  },
];
