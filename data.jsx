// Mock data — 冀东油田西部勘探开发区 会议提醒
const MOCK = {
  currentUser: { name: '李思琪', dept: '勘探开发研究所', position: '工程师', role: 'user', email: 'lisiqi@petrochina.com.cn', phone: '139****1234' },

  // Org tree (人事组织架构)
  org: {
    name: '冀东油田西部勘探开发区',
    children: [
      {
        name: '党政办公室',
        head: '陈敏',
        members: [
          { name: '陈敏', position: '主任', phone: '139****0001' },
          { name: '徐婕', position: '副主任', phone: '139****0002' },
          { name: '林诚', position: '秘书', phone: '139****0003' },
        ],
      },
      {
        name: '勘探开发研究所',
        head: '王浩然',
        members: [
          { name: '王浩然', position: '所长', phone: '139****0011' },
          { name: '李思琪', position: '工程师', phone: '139****1234' },
          { name: '赵小冉', position: '工程师', phone: '139****0012' },
          { name: '周明', position: '助理工程师', phone: '139****0013' },
          { name: '孙云', position: '高级工程师', phone: '139****0014' },
        ],
      },
      {
        name: '采油作业区',
        head: '黄佳',
        members: [
          { name: '黄佳', position: '区长', phone: '139****0021' },
          { name: '吴磊', position: '副区长', phone: '139****0022' },
          { name: '何雨', position: '技术员', phone: '139****0023' },
          { name: '周清', position: '技术员', phone: '139****0024' },
          { name: '马骁', position: '安全员', phone: '139****0025' },
        ],
      },
      {
        name: '安全环保科',
        head: '杨建国',
        members: [
          { name: '杨建国', position: '科长', phone: '139****0031' },
          { name: '刘慧', position: '工程师', phone: '139****0032' },
        ],
      },
      {
        name: '生产运行科',
        head: '韩志远',
        members: [
          { name: '韩志远', position: '科长', phone: '139****0041' },
          { name: '丁瑞', position: '调度员', phone: '139****0042' },
          { name: '邓磊', position: '调度员', phone: '139****0043' },
        ],
      },
      {
        name: '财务资产科',
        head: '高雪',
        members: [
          { name: '高雪', position: '科长', phone: '139****0051' },
          { name: '罗静', position: '会计', phone: '139****0052' },
        ],
      },
    ],
  },

  meetings: [
    {
      id: 'm1', title: 'Q2 西部区块勘探评审会', type: '评审',
      date: '2026-04-25', start: '10:00', end: '11:30',
      location: '基地 · 3F 启明会议室', address: '河北省唐山市曹妃甸区冀东油田西部基地',
      online: false, host: '王浩然', hostDept: '勘探开发研究所',
      attendees: ['李思琪', '王浩然', '赵小冉', '周明', '孙云', '黄佳', '吴磊', '徐婕'],
      agenda: [
        { time: '10:00', label: '开场及目标对齐', who: '王浩然' },
        { time: '10:15', label: 'Q1 钻井数据复盘', who: '赵小冉' },
        { time: '10:45', label: 'Q2 勘探部署评审', who: '李思琪' },
        { time: '11:15', label: '行动项与责任人', who: '王浩然' },
      ],
      attachments: [{ name: 'Q2 勘探评审材料.pdf', size: '2.4 MB' }, { name: '区块储量对比表.xlsx', size: '320 KB' }],
      requireCheckin: true, requireConfirm: true, myStatus: 'pending',
      stats: { total: 8, confirmed: 5, pending: 2, leave: 1, checkedIn: 0 },
    },
    {
      id: 'm2', title: '周一生产例会', type: '例会',
      date: '2026-04-25', start: '14:00', end: '14:45',
      location: '视频会议系统', address: 'meeting.petrochina.com.cn/jd-west',
      online: true, host: '韩志远', hostDept: '生产运行科',
      attendees: ['李思琪', '王浩然', '赵小冉', '周明', '孙云', '韩志远', '丁瑞'],
      agenda: [
        { time: '14:00', label: '本周生产指标同步', who: '韩志远' },
        { time: '14:20', label: '现场问题与协作', who: '全员' },
        { time: '14:35', label: '下周作业安排', who: '丁瑞' },
      ],
      attachments: [], requireCheckin: false, requireConfirm: true, myStatus: 'confirmed',
      stats: { total: 7, confirmed: 7, pending: 0, leave: 0, checkedIn: 0 },
    },
    {
      id: 'm3', title: '新员工入职安全培训', type: '培训',
      date: '2026-04-27', start: '09:30', end: '12:00',
      location: '基地 · B1 多功能厅', address: '河北省唐山市曹妃甸区冀东油田西部基地',
      online: false, host: '陈敏', hostDept: '党政办公室',
      attendees: ['李思琪', '王浩然', '赵小冉', '周明', '孙云', '黄佳', '吴磊', '徐婕', '林诚', '何雨', '周清', '马骁'],
      agenda: [
        { time: '09:30', label: '油田概况与企业文化', who: '陈敏' },
        { time: '10:00', label: '人事制度', who: '徐婕' },
        { time: '11:00', label: 'HSE 安全培训', who: '杨建国' },
      ],
      attachments: [{ name: '员工手册 v3.pdf', size: '5.1 MB' }],
      requireCheckin: true, requireConfirm: true, myStatus: 'confirmed',
      stats: { total: 12, confirmed: 9, pending: 3, leave: 0, checkedIn: 0 },
    },
    {
      id: 'm4', title: '甲方需求对齐 · 中石油总部', type: '临时',
      date: '2026-04-28', start: '15:00', end: '16:00',
      location: '基地 · 7F 凌云会议室', address: '河北省唐山市曹妃甸区冀东油田西部基地',
      online: false, host: '李思琪', hostDept: '勘探开发研究所',
      attendees: ['李思琪', '王浩然', '赵小冉'],
      agenda: [
        { time: '15:00', label: '甲方背景与诉求', who: '李思琪' },
        { time: '15:30', label: '技术方案讨论', who: '全员' },
      ],
      attachments: [], requireCheckin: false, requireConfirm: true, myStatus: 'pending',
      stats: { total: 3, confirmed: 1, pending: 2, leave: 0, checkedIn: 0 },
    },
    {
      id: 'm5', title: '月度全员大会', type: '例会',
      date: '2026-04-30', start: '17:00', end: '18:00',
      location: '基地 · B1 多功能厅', address: '河北省唐山市曹妃甸区冀东油田西部基地',
      online: false, host: '陈敏', hostDept: '党政办公室',
      attendees: ['李思琪', '王浩然', '赵小冉', '周明', '孙云', '黄佳', '吴磊', '徐婕'],
      agenda: [{ time: '17:00', label: '月度生产总结', who: '陈敏' }],
      attachments: [], requireCheckin: true, requireConfirm: true, myStatus: 'pending',
      stats: { total: 36, confirmed: 18, pending: 16, leave: 2, checkedIn: 0 },
    },
  ],
};

window.MOCK = MOCK;
