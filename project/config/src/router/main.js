// const MainLayOut = () => import('@/views/main/layout');
const Main = () => import('@/views/main/index');

const Hlayout = () => import('@/views/host/layout');
const Hosts = () => import('@/views/host/hosts');
const AddHost = () => import('@/views/host/addHost');
const HostDetail = () => import('@/views/host/hostDetail');
const Groups = () => import('@/views/hostGroups/groups');
const GroupsDetail = () => import('@/views/hostGroups/groupsDetail');

const ClusterLists = () => import('@/views/cluster/ClusterLists');
const ClusterService = () => import('@/views/cluster/clusterService');


const ClusterHost = () => import('@/views/cluster/ClusterHost');

const Serviceinstant = () => import('@/views/service/serviceinstant');


// const ClusterService = () => import('@/views/cluster/ClusterService');

const ServiceDetail = () => import('@/views/service/serviceDetail');
const ServiceLists = () => import('@/views/service/serviceLists');
// const ServiceRole = () => import('@/views/service/serviceRole');
const ServiceAddHost = () => import('@/views/service/addHost');

const SystemUser = () => import('@/views/system/user');
const SystemService = () => import('@/views/system/service');

// const echarts = () => import('@/views/main/echarts');
// const form = () => import('@/views/main/form');
export default [
  { path: '/', redirect: '/overview' },
  { path: '/overview', component: Main, meta: { title: '概览' } },
  { path: '/host',
    component: Hlayout,
    meta: { title: '主机管理' },
    children: [
      {
        path: 'hosts',
        component: Hlayout,
        meta: { title: '主机列表' },
        children: [
          { path: '', component: Hosts },
          { path: 'addhost', component: AddHost, meta: { title: '添加主机' } },
          { path: 'hostDetail/:id', component: HostDetail, meta: { title: '主机详情' } },
        ],
      },
      {
        path: 'groups',
        component: Hlayout,
        meta: { title: '主机组' },
        children: [
          { path: '', component: Groups },
          { path: 'groupsDetail/:id', component: GroupsDetail, meta: { title: '主机组详情' } },
        ],
      },
    ],
  },
  {
    path: '/cluster',
    component: Hlayout,
    meta: { title: '集群管理' },
    children: [
      { path: '', redirect: '/cluster/host' },
      {
        path: 'host',
        component: Hlayout,
        meta: { title: '集群列表' },
        children: [
          { path: '', component: ClusterLists },
          { path: ':id', component: ClusterHost, meta: { title: '集群主机' } },
          {
            path: 'clusterService/:id',
            component: ClusterService,
            meta: {
              title: '集群服务',
            },
          },


        ],
      },
      // { path: ':id', component: ClusterHost, meta: { title: '集群主机' } },

      { path: 'service',
        component: Hlayout,
        meta: { title: '服务列表' },
        children: [
          { path: '', component: ServiceLists },
          { path: 'addhost', component: ServiceAddHost, meta: { title: '绑定实例' } },
          { path: ':id', component: ServiceDetail, meta: { title: '服务详情' } },
          {
            path: 'serviceinstant/:id',
            component: Serviceinstant,
            meta: {
              title: '实例详情',
            },
          },
          // { path: 'role/:id', component: ServiceRole, meta: { title: '角色管理' } },
        ],
      },
    ],
  },
  {
    path: '/system',
    component: Hlayout,
    meta: { title: '系统管理' },
    children: [
      { path: '', redirect: '/system/user' },
      { path: 'user', component: SystemUser, meta: { title: '用户管理' } },
      { path: 'service', component: SystemService, meta: { title: '参数配置' } },
    ],
  },
];
