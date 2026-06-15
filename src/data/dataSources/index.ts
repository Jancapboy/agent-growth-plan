// src/data/dataSources/index.ts - 数据源模板库

import { DataSource } from '@/types/dataSource';

export const dataSourceTemplates: DataSource[] = [
  {
    id: 'users',
    name: '用户中心',
    fields: [
      { id: 'u1', name: 'user_id', type: 'INT', semantic: '用户唯一标识', sample: '10042' },
      { id: 'u2', name: 'username', type: 'STRING', semantic: '用户名', sample: 'alice_dev' },
      { id: 'u3', name: 'email', type: 'STRING', semantic: '邮箱地址', sample: 'alice@example.com' },
      { id: 'u4', name: 'created_at', type: 'TIMESTAMP', semantic: '注册时间', sample: '2024-01-15T09:30:00Z' },
      { id: 'u5', name: 'status', type: 'STRING', semantic: '用户状态', sample: 'active' },
    ],
    reliability: 95,
    integrationStatus: 'connected',
  },
  {
    id: 'orders',
    name: '订单系统',
    fields: [
      { id: 'o1', name: 'order_id', type: 'STRING', semantic: '订单唯一标识', sample: 'ORD-2024-001' },
      { id: 'o2', name: 'uid', type: 'VARCHAR', semantic: '用户唯一标识', sample: 'U-10042' },
      { id: 'o3', name: 'amount', type: 'FLOAT', semantic: '订单金额', sample: '299.99' },
      { id: 'o4', name: 'order_time', type: 'TIMESTAMP', semantic: '下单时间', sample: '2024-06-15 14:30:00' },
      { id: 'o5', name: 'state', type: 'INT', semantic: '订单状态', sample: '1' },
    ],
    reliability: 88,
    integrationStatus: 'unconnected',
  },
  {
    id: 'crm',
    name: 'CRM 系统',
    fields: [
      { id: 'c1', name: 'customer_id', type: 'STRING', semantic: '客户唯一标识', sample: 'C-10042' },
      { id: 'c2', name: 'name', type: 'STRING', semantic: '客户姓名', sample: 'Alice Wang' },
      { id: 'c3', name: 'email_addr', type: 'STRING', semantic: '邮箱地址', sample: 'alice@example.com' },
      { id: 'c4', name: 'signup_date', type: 'STRING', semantic: '注册时间', sample: '2024-01-15' },
      { id: 'c5', name: 'level', type: 'STRING', semantic: '客户等级', sample: 'VIP' },
    ],
    reliability: 82,
    integrationStatus: 'unconnected',
  },
  {
    id: 'analytics',
    name: '埋点平台',
    fields: [
      { id: 'a1', name: 'event_id', type: 'STRING', semantic: '事件唯一标识', sample: 'EVT-abc123' },
      { id: 'a2', name: 'user_id_str', type: 'STRING', semantic: '用户唯一标识', sample: '10042' },
      { id: 'a3', name: 'event_name', type: 'STRING', semantic: '事件名称', sample: 'click_buy_button' },
      { id: 'a4', name: 'timestamp_ms', type: 'INT', semantic: '时间戳', sample: '1718461800000' },
      { id: 'a5', name: 'properties', type: 'JSON', semantic: '事件属性', sample: '{"price": 299.99}' },
    ],
    reliability: 75,
    integrationStatus: 'unconnected',
  },
  {
    id: 'payment',
    name: '支付网关',
    fields: [
      { id: 'p1', name: 'transaction_id', type: 'STRING', semantic: '交易唯一标识', sample: 'TXN-xyz789' },
      { id: 'p2', name: 'payer_id', type: 'INT', semantic: '用户唯一标识', sample: '10042' },
      { id: 'p3', name: 'sum', type: 'FLOAT', semantic: '订单金额', sample: '299.99' },
      { id: 'p4', name: 'pay_time', type: 'TIMESTAMP', semantic: '支付时间', sample: '2024-06-15T14:32:00.000Z' },
      { id: 'p5', name: 'pay_status', type: 'STRING', semantic: '支付状态', sample: 'SUCCESS' },
    ],
    reliability: 99,
    integrationStatus: 'unconnected',
  },
];
